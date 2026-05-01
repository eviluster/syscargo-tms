import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
// import { InjectModel } from "@nestjs/mongoose";
// import { Model } from "mongoose";
// import { Parking } from "../models/schema/parking.schema";
import { User } from '../user/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { AuthDto } from './dto/auth.dto';
import { TokenDto } from './dto/token.dto';
import { LogOutDto } from './dto/logOut.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { randomBytes } from 'crypto';

@Injectable({})
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(PasswordResetToken)
    private passwordResetTokenRepository: Repository<PasswordResetToken>,

    private jwt: JwtService,
    private config: ConfigService,

    // @InjectModel('Parking') private readonly ModelParking: Model<Parking>,
  ) {}

  async login(dto: LoginDto) {
    // find the user by username
    const user = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (!user) {
      throw new ForbiddenException('User Name do not exist');
    }
    // otherwise continue
    // compare password
    const pwMatch = await argon.verify(user.hash, dto.password);
    // if password incorrect throw an exception
    if (!pwMatch) {
      throw new ForbiddenException('Password incorrects.');
    }
    // otherwise continue
    // check if user is already logged
    const role = await this.roleRepository.findOne({
      where: { id: '792e024b-f781-4f39-ba6a-2445fc1db712' },
    });
    console.log(role);
    console.log(user.role);

    if (user.role.id == role.id) {
      console.log('es el mismo');
      user.isLogged = false;
    }
    if (user.isLogged) {
      // throw new ForbiddenException('User already logged');
      user.isLogged = false;
      console.log(
        `Forzando logout previo del usuario ${user.id} para permitir re-login.`,
      );
    }

    if (user.role.id != role.id) {
      console.log('no es el mismo');
      user.isLogged = false;
    }

    await this.userRepository.save(user);
    // return the save user token

    const refresh_token = await this.signToken(user.id, user.username, '1d');

    return {
      userID: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      lastname: user.lastname,
      phone: user.phone,
      refresh_token: refresh_token,
      role: user.role,
    };
  }

  async logOut(dto: LogOutDto) {
    // find the user by username
    console.log('DTO del usuario a desloguear', dto);

    const user = await this.userRepository.findOne({
      where: { id: dto.id },
    });

    console.log('Usuario encontrado para desautenticar', user);

    if (!user) {
      throw new ForbiddenException('User Name do not exist');
    }
    // otherwise continue
    // poner  is logged false
    user.isLogged = false;
    await this.userRepository.save(user);
    // return the save user token
    return true;
  }

  async signupAdmin(dto: CreateUserDto) {
    // to register only the first admin
    //generate the password hash
    const hash = await argon.hash(dto.password);

    // get the Admin Role
    // TODO
    const role = await this.roleRepository.findOne({
      where: {
        id: '792e024b-f781-4f39-ba6a-2445fc1db712',
        // id:"dc3ab524-d911-4f8a-93a6-5ab0a524f2bc"
      },
    });
    // search for another user with the same username
    let userExist = await this.userRepository.findOneBy({
      username: dto.username,
    });
    if (userExist) {
      throw new ConflictException(`The user Name ${dto.username} is taken.`);
    }
    // search if exist any admin
    // TODO
    if (role) {
      userExist = await this.userRepository.findOneBy({
        role: role,
      });
      if (userExist) {
        throw new ConflictException(`There is an admin already.`);
      }
    }

    // otherwise continue
    //save the user in the BD
    let user = this.userRepository.create({
      username: dto.username,
      email: dto.username,
      hash: hash,
      role: role,
      name: dto.name,
      phone: dto.phone,
      isLogged: false,
      isActive: true,
      lastname: dto.lastname,
    });
    user = await this.userRepository.save(user);
    // return the save user token
    return this.signToken(user.id, user.username, '1m');
  }

  async signup(dto: CreateUserDto) {
    //generate the password hash
    console.log(dto);

    const hash = await argon.hash(dto.password);

    // get the Client Role
    // TODO
    const role = await this.roleRepository.findOneBy({
      id: '79beb28a-a469-49eb-bda1-ae1c5e4a9261',
    });
    // search for another user with the same username
    const userExist = await this.userRepository.findOneBy({
      username: dto.username,
    });
    if (userExist) {
      throw new ConflictException(`The user Name ${dto.username} is taken.`);
    }
    // otherwise continue
    //save the user in the BD
    let user = this.userRepository.create({
      hash: hash,
      role: role,
      name: dto.name,
      email: dto.email,
      username: dto.username,
      phone: dto.phone,
      isLogged: false,
      isActive: true,
      lastname: dto.lastname,
    });
    user = await this.userRepository.save(user);

    //  check if user is already logged

    // return the save user token
    const access_token = this.signToken(user.id, user.username, '1m');
    const refresh_token = this.signToken(user.id, user.username, '480m');
    return {
      rol: user.role.id,
      name: user.name,
      email: user.email,
      username: user.username,
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  async signToken(
    userID: string,
    username: string,
    time: string,
  ): Promise<any> {
    const payload = {
      sub: userID,
      username: username,
    };
    const secret = this.config.get('JWT_SECRET_KEY');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: time,
      secret: secret,
    });
    return token;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const secret = this.config.get('JWT_SECRET_KEY');
      await this.jwt.verifyAsync(token, {
        secret: secret,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async isTokenExpired(dto: TokenDto): Promise<any> {
    const token = dto.token;
    try {
      const secret = this.config.get('JWT_SECRET_KEY');
      await this.jwt.verifyAsync(token, {
        secret: secret,
        ignoreExpiration: true, // Verify everything except expiration
      });
      try {
        // Now check expiration
        await this.jwt.verifyAsync(token, {
          secret: secret,
        });
        return false; // Token is valid and not expired
      } catch (expError) {
        if (expError.name === 'TokenExpiredError') {
          // Get user info from expired token
          const decodedToken = this.jwt.decode(token);
          if (decodedToken && typeof decodedToken === 'object') {
            // Generate new token with same user info
            const newToken = await this.signToken(
              decodedToken.sub,
              decodedToken.username,
              '1m',
            );
            return newToken;
          }
        }
        return false; // Other verification error
      }
    } catch (error) {
      return false; // Invalid token
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    // Always return a generic success message to prevent user enumeration
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return;
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token valid for 1 hour

    const passwordResetToken = this.passwordResetTokenRepository.create({
      token,
      expiresAt,
      user,
      email,
    });

    await this.passwordResetTokenRepository.save(passwordResetToken);

    // Simulate sending email (replace with actual email service)
    console.log(`Sending password reset email to ${email} with token: ${token}`);
    console.log(`Reset link: /reset-password?token=${token}&email=${email}`);
    // In a real application, you would use an email service here:
    // await this.emailService.sendResetPasswordEmail(user, token);
  }

  async resetPassword(token: string, email: string, newPassword: string, passwordConfirmation: string): Promise<void> {
    if (newPassword !== passwordConfirmation) {
      throw new ForbiddenException('Las contraseñas no coinciden.');
    }

    const resetTokenEntity = await this.passwordResetTokenRepository.findOne({
      where: { token, email, used: false },
      relations: ['user'],
    });

    if (!resetTokenEntity || resetTokenEntity.expiresAt < new Date()) {
      throw new ForbiddenException('Token de restablecimiento inválido o expirado.');
    }

    const user = resetTokenEntity.user;
    if (!user) {
      throw new ForbiddenException('Usuario no encontrado asociado al token.');
    }

    // Apply password policy (e.g., minimum length, complexity)
    if (newPassword.length < 6) { // Example: minimum 6 characters
      throw new ForbiddenException('La contraseña debe tener al menos 6 caracteres.');
    }
    // Add more password policy checks here (e.g., complexity)

    user.hash = await argon.hash(newPassword);
    await this.userRepository.save(user);

    resetTokenEntity.used = true;
    await this.passwordResetTokenRepository.save(resetTokenEntity);

    console.log(`Password for user ${user.username} reset successfully.`);
  }

  async loggedOut(dto: LogOutDto): Promise<any> {
    // find the user by username
    const user = await this.userRepository.findOneBy({
      id: dto.id,
    });

    if (!user) {
      throw new ForbiddenException('User Name do not exist');
    }
    // otherwise continue
    // poner  is logged false
    user.isLogged = false;
    await this.userRepository.save(user);
    // return the save user token
    return true;
  }
}
