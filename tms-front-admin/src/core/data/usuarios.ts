interface IUsuario {
  id: number;
  name: string;
  email: string;
  role: string;

  date: string;
}

const usuarios: Array<IUsuario> = [
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Emma Smith",
    email: "e.smith@kpmg.com.au",
    role: "moderator",
    date: "14 Dec 2020, 8:43 pm",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Melody Macy",
    email: "melody@altbox.com",
    role: "editor",
    date: "01 Dec 2020, 10:12 am",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Max Smith",
    email: "max@kt.com",
    role: "admin",
    date: "12 Nov 2020, 2:01 pm",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Sean Bean",
    email: "sean@dellito.com",
    role: "editor",
    date: "21 Oct 2020, 5:54 pm",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Brian Cox",
    email: "brian@exchange.com",
    role: "user",
    date: "19 Oct 2020, 7:32 am",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Mikaela Collins",
    email: "mikaela@pexcom.com",
    role: "admin",
    date: "23 Sep 2020, 12:37 am",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Francis Mitcham",
    email: "f.mitcham@kpmg.com.au",
    role: "moderator",
    date: "11 Sep 2020, 3:15 pm",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Olivia Wild",
    email: "olivia@corpmail.com",
    role: "admin",
    date: "03 Sep 2020, 1:08 am",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Neil Owen",
    email: "owen.neil@gmail.com",
    role: "moderator",
    date: "01 Sep 2020, 4:58 pm",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Dan Wilson",
    email: "dam@consilting.com",
    role: "moderator",
    date: "18 Aug 2020, 3:34 pm",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Emma Bold",
    email: "emma@intenso.com",
    role: "user",
    date: "14 Aug 2020, 1:21 pm",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Ana Crown",
    email: "ana.cf@limtel.com",
    role: "moderator",
    date: "11 Aug 2020, 5:13 pm",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Emma Smith",
    email: "e.smith@kpmg.com.au",
    role: "editor",
    date: "14 Dec 2020, 8:43 pm",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Melody Macy",
    email: "melody@altbox.com",
    role: "editor",
    date: "01 Dec 2020, 10:12 am",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Max Smith",
    email: "max@kt.com",
    role: "editor",
    date: "12 Nov 2020, 2:01 pm",
  },
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Sean Bean",
    email: "sean@dellito.com",
    role: "editor",
    date: "21 Oct 2020, 5:54 pm",
  },
];

export type { IUsuario };

export default usuarios;
