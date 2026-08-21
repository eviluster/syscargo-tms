#!/bin/bash

set -e

mkdir -p certs

echo "🔐 Generando CA privada..."
openssl genrsa -out certs/ca.key 4096

echo "🔐 Generando certificado CA..."
openssl req -x509 -new -nodes -key certs/ca.key -sha256 -days 3650 \
  -out certs/ca.crt \
  -subj "/C=CU/ST=La Habana/L=La Habana/O=SysCargo/OU=Dev/CN=SysCargo Local CA" \
  -extensions v3_ca \
  -config <(cat <<EOF
[req]
distinguished_name = req_distinguished_name
[req_distinguished_name]
[v3_ca]
basicConstraints = critical, CA:TRUE
keyUsage = critical, digitalSignature, cRLSign, keyCertSign
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
EOF
)

echo "🔐 Generando clave del servidor..."
openssl genrsa -out certs/syscargo.cu.key 4096

echo "🔐 Creando CSR con SANs..."
cat > certs/syscargo.cu.cnf <<'EOF'
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = CU
ST = La Habana
L = La Habana
O = SysCargo
OU = Dev
CN = *.syscargo.cu

[v3_req]
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = syscargo.cu
DNS.2 = *.syscargo.cu
DNS.3 = tms.syscargo.cu
DNS.4 = admin.syscargo.cu
DNS.5 = api.syscargo.cu
DNS.6 = tmsdb.syscargo.cu
EOF

echo "🔐 Generando CSR..."
openssl req -new -key certs/syscargo.cu.key \
  -out certs/syscargo.cu.csr \
  -config certs/syscargo.cu.cnf

echo "🔐 Firmando certificado con la CA..."
openssl x509 -req -in certs/syscargo.cu.csr \
  -CA certs/ca.crt -CAkey certs/ca.key \
  -CAcreateserial -out certs/syscargo.cu.crt \
  -days 365 -sha256 \
  -extensions v3_req -extfile certs/syscargo.cu.cnf

echo "🔐 Verificando certificado..."
openssl x509 -in certs/syscargo.cu.crt -text -noout | grep -A2 "Key Usage"

echo "🔐 Creando configuración TLS para Traefik..."
cat > certs/tls.yml <<'EOF'
tls:
  certificates:
    - certFile: /certs/syscargo.cu.crt
      keyFile: /certs/syscargo.cu.key
  stores:
    default:
      defaultCertificate:
        certFile: /certs/syscargo.cu.crt
        keyFile: /certs/syscargo.cu.key
EOF

echo ""
echo "✅ Certificados generados correctamente"
echo ""
echo "📌 IMPORTANTE: Reinstala el CA en tu Mac:"
echo "   sudo security delete-certificate -c 'SysCargo Local CA' /Library/Keychains/System.keychain 2>/dev/null || true"
echo "   sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain certs/ca.crt"
