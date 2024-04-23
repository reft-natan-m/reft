import { Property, User } from "@prisma/client";
import prisma from "./prisma";
import bcrypt from "bcrypt";
import { Amarante } from "next/font/google";

interface SeedUser {
  username: string;
  email: string;
  hashedPassword: string;
  emailVerified: boolean;
  avatar: string;
}

async function main() {
  const hashedPassword = await bcrypt.hash("123", 10);

  let users: SeedUser[] = [];

  await prisma.token.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  for (let i = 2; i < 12; i++) {
    users.push({
      username: `user${i}`,
      email: `user${i}@gmail.com`,
      hashedPassword,
      emailVerified: true,
      avatar: `https://api.dicebear.com/8.x/identicon/svg?seed=user${i}`,
    });
  }

  let dbUsers: User[] = [];

  for (const user of users) {
    const userResult = await prisma.user.create({
      data: {
        ...user,
      },
    });

    dbUsers.push(userResult);

    console.log(`Created user with id: ${userResult.id}`);
  }

  interface PropertyUsers {
    owner: string;
    amount: number;
    listed: number;
  }

  interface PropertyData {
    property: Property;
    users: PropertyUsers[];
  }

  const properties: PropertyData[] = [
    {
      property: {
        id: "6624e6e87604647d7f03651b",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "1811 skyline way",
        street2: "",
        zip: "92831",
        year: 1961,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 3439,
        value: 1750000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [{ owner: dbUsers[0].id, amount: 100, listed: 0 }],
    },
    {
      property: {
        id: "6624e9a37604647d7f036524",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "2409 hilltop ct",
        street2: "",
        zip: "92835",
        year: 1978,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 2191,
        value: 1250000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[0].id, amount: 50, listed: 25 },
        { owner: dbUsers[1].id, amount: 0, listed: 25 },
      ],
    },
    {
      property: {
        id: "6624ea537604647d7f03652c",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "1211 anita pl",
        street2: "",
        zip: "92831",
        year: 1973,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 2819,
        value: 1788000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[0].id, amount: 25, listed: 25 },
        { owner: dbUsers[1].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "6624eace7604647d7f036533",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "1100 n acacia ave",
        street2: "",
        zip: "92831",
        year: 1958,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 1282,
        value: 1099000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[0].id, amount: 0, listed: 50 },
        { owner: dbUsers[1].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "6624eb367604647d7f036536",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "605 princeton cir e",
        street2: "",
        zip: "92831",
        year: 1950,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 1594,
        value: 1030000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [{ owner: dbUsers[1].id, amount: 100, listed: 0 }],
    },
    {
      property: {
        id: "6624eb807604647d7f036539",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "1612 n hale ave",
        street2: "",
        zip: "92831",
        year: 1974,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 2760,
        value: 1400000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[1].id, amount: 50, listed: 25 },
        { owner: dbUsers[2].id, amount: 25, listed: 0 },
      ],
    },
    {
      property: {
        id: "6624ebc17604647d7f03653c",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "2701 terraza pl",
        street2: "",
        zip: "92835",
        year: 1992,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 6609,
        value: 3599000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[1].id, amount: 25, listed: 25 },
        { owner: dbUsers[2].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "6624ec0b7604647d7f03653f",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "2024 calle miranda",
        street2: "",
        zip: "92833",
        year: 1965,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 2370,
        value: 1475000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[1].id, amount: 50, listed: 0 },
        { owner: dbUsers[2].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "6624ec957604647d7f036542",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "3166 e palm dr",
        street2: "unit 62",
        zip: "92831",
        year: 1976,
        propType: "Residential",
        propSubtype: "Condominium",
        size: 1408,
        value: 625000,
        income: 0,
        expense: 420,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [{ owner: dbUsers[2].id, amount: 100, listed: 0 }],
    },
    {
      property: {
        id: "6624ecd07604647d7f036545",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "653 w glenwood dr",
        street2: "",
        zip: "92832",
        year: 1972,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 1969,
        value: 880000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[2].id, amount: 50, listed: 25 },
        { owner: dbUsers[3].id, amount: 25, listed: 0 },
      ],
    },
    {
      property: {
        id: "6624f6ed7604647d7f03654c",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "2971 la travesia dr",
        street2: "",
        zip: "92835",
        year: 1964,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 2891,
        value: 1349000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[2].id, amount: 25, listed: 25 },
        { owner: dbUsers[3].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "6624f7a27604647d7f036557",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "1401 pinon pl",
        street2: "#1",
        zip: "92835",
        year: 1979,
        propType: "Residential",
        propSubtype: "Condominium",
        size: 1394,
        value: 768888,
        income: 0,
        expense: 370,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[2].id, amount: 0, listed: 50 },
        { owner: dbUsers[3].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "6624f7dc7604647d7f03655a",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "2000 calle serena",
        street2: "",
        zip: "92833",
        year: 1965,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 2069,
        value: 1399000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [{ owner: dbUsers[3].id, amount: 100, listed: 0 }],
    },
    {
      property: {
        id: "6624f8ac7604647d7f036563",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "2290 evans st",
        street2: "",
        zip: "92833",
        year: 2003,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 3229,
        value: 1499000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[3].id, amount: 50, listed: 25 },
        { owner: dbUsers[4].id, amount: 25, listed: 0 },
      ],
    },
    {
      property: {
        id: "6624f8df7604647d7f036566",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "1827 catlin st",
        street2: "",
        zip: "92833",
        year: 2003,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 3854,
        value: 2180000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[3].id, amount: 25, listed: 25 },
        { owner: dbUsers[4].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "6624f72b7604647d7f036551",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "143 s pritchard ave",
        street2: "",
        zip: "92833",
        year: 2001,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 1400,
        value: 740000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[3].id, amount: 0, listed: 50 },
        { owner: dbUsers[4].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "6624f86a7604647d7f036560",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "3215 arbol dr",
        street2: "",
        zip: "92835",
        year: 1952,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 2593,
        value: 1888000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [{ owner: dbUsers[4].id, amount: 100, listed: 0 }],
    },
    {
      property: {
        id: "6624f7627604647d7f036554",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "2318 camino recondito",
        street2: "",
        zip: "92833",
        year: 1964,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 2024,
        value: 1495000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[4].id, amount: 50, listed: 25 },
        { owner: dbUsers[5].id, amount: 25, listed: 0 },
      ],
    },
    {
      property: {
        id: "6624f8327604647d7f03655d",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "609 lake ter",
        street2: "",
        zip: "92835",
        year: 1955,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 3028,
        value: 2089000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[4].id, amount: 25, listed: 25 },
        { owner: dbUsers[5].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "6624f9347604647d7f036569",
        country: "United States",
        state: "CA",
        city: "fullerton",
        street1: "214 magnolia ave",
        street2: "",
        zip: "92833",
        year: 1929,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 1955,
        value: 1251680,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[4].id, amount: 0, listed: 50 },
        { owner: dbUsers[5].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "66275d9b62c199997115cd74",
        country: "United States",
        state: "CA",
        city: "irvine",
        street1: "62 linhaven",
        street2: "",
        zip: "92602",
        year: 1999,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 2480,
        value: 1800000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [{ owner: dbUsers[5].id, amount: 100, listed: 0 }],
    },
    {
      property: {
        id: "66275e1e62c199997115cd79",
        country: "United States",
        state: "CA",
        city: "irvine",
        street1: "8 ticonderoga",
        street2: "",
        zip: "92620",
        year: 1981,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 2427,
        value: 1998000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[5].id, amount: 50, listed: 25 },
        { owner: dbUsers[6].id, amount: 25, listed: 0 },
      ],
    },
    {
      property: {
        id: "66275e4d62c199997115cd7e",
        country: "United States",
        state: "CA",
        city: "irvine",
        street1: "80 navigator",
        street2: "",
        zip: "92620",
        year: 2010,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 2619,
        value: 209900,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[5].id, amount: 25, listed: 25 },
        { owner: dbUsers[6].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "66275e7262c199997115cd80",
        country: "United States",
        state: "CA",
        city: "irvine",
        street1: "54 cipresso",
        street2: "",
        zip: "92618",
        year: 2012,
        propType: "Residential",
        propSubtype: "Condominium",
        size: 2083,
        value: 2175000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[5].id, amount: 0, listed: 50 },
        { owner: dbUsers[6].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "66275ea462c199997115cd82",
        country: "United States",
        state: "CA",
        city: "irvine",
        street1: "335 paradiso",
        street2: "",
        zip: "92602",
        year: 2023,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 2548,
        value: 3560000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [{ owner: dbUsers[6].id, amount: 100, listed: 0 }],
    },
    {
      property: {
        id: "66275ecb62c199997115cd84",
        country: "United States",
        state: "CA",
        city: "irvine",
        street1: "3706 provincetown ave",
        street2: "",
        zip: "92606",
        year: 1970,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 2402,
        value: 1788000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[6].id, amount: 50, listed: 25 },
        { owner: dbUsers[7].id, amount: 25, listed: 0 },
      ],
    },
    {
      property: {
        id: "66275ef762c199997115cd86",
        country: "United States",
        state: "CA",
        city: "irvine",
        street1: "203 bright poppy",
        street2: "",
        zip: "92618",
        year: 2016,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 1734,
        value: 1530000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[6].id, amount: 25, listed: 25 },
        { owner: dbUsers[7].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "662760dc62c199997115cd97",
        country: "United States",
        state: "CA",
        city: "irvine",
        street1: "24 charlotte",
        street2: "",
        zip: "92603",
        year: 1993,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 4676,
        value: 5498000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[6].id, amount: 0, listed: 50 },
        { owner: dbUsers[7].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "662760f862c199997115cd99",
        country: "United States",
        state: "CA",
        city: "irvine",
        street1: "14632 orange acres ln",
        street2: "",
        zip: "92604",
        year: 1972,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 1176,
        value: 1060000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [{ owner: dbUsers[7].id, amount: 100, listed: 0 }],
    },
    {
      property: {
        id: "662761a962c199997115cd9f",
        country: "United States",
        state: "CA",
        city: "irvine",
        street1: "66 gainsboro",
        street2: "",
        zip: "92620",
        year: 2013,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 3614,
        value: 3049000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[7].id, amount: 50, listed: 25 },
        { owner: dbUsers[8].id, amount: 25, listed: 0 },
      ],
    },
    {
      property: {
        id: "662761ca62c199997115cda1",
        country: "United States",
        state: "CA",
        city: "brea",
        street1: "354 olinda dr",
        street2: "",
        zip: "92823",
        year: 2009,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 2640,
        value: 1500000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[7].id, amount: 25, listed: 25 },
        { owner: dbUsers[8].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "662762a662c199997115cda7",
        country: "United States",
        state: "CA",
        city: "brea",
        street1: "2267 crestview cir",
        street2: "",
        zip: "92821",
        year: 1976,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 1924,
        value: 1188000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[7].id, amount: 0, listed: 50 },
        { owner: dbUsers[8].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "662762e462c199997115cda9",
        country: "United States",
        state: "CA",
        city: "brea",
        street1: "292 cattail cir",
        street2: "",
        zip: "92821",
        year: 1980,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 2327,
        value: 1100000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [{ owner: dbUsers[8].id, amount: 100, listed: 0 }],
    },
    {
      property: {
        id: "6627602f62c199997115cd93",
        country: "United States",
        state: "CA",
        city: "brea",
        street1: "928 baxter pkwy",
        street2: "",
        zip: "92821",
        year: 2004,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 2342,
        value: 1250000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[8].id, amount: 50, listed: 25 },
        { owner: dbUsers[9].id, amount: 25, listed: 0 },
      ],
    },
    {
      property: {
        id: "6627625c62c199997115cda3",
        country: "United States",
        state: "CA",
        city: "brea",
        street1: "1902 e eucalyptus ln",
        street2: "",
        zip: "92821",
        year: 1972,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 1800,
        value: 1050000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[8].id, amount: 25, listed: 25 },
        { owner: dbUsers[9].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "6627606562c199997115cd95",
        country: "United States",
        state: "CA",
        city: "brea",
        street1: "3183 e phillips ct",
        street2: "",
        zip: "92821",
        year: 2012,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 3390,
        value: 1999888,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [
        { owner: dbUsers[8].id, amount: 0, listed: 50 },
        { owner: dbUsers[9].id, amount: 25, listed: 25 },
      ],
    },
    {
      property: {
        id: "6627615562c199997115cd9b",
        country: "United States",
        state: "CA",
        city: "brea",
        street1: "1342 oakcrest ave",
        street2: "",
        zip: "92821",
        year: 1966,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 2752,
        value: 1290000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [{ owner: dbUsers[9].id, amount: 100, listed: 0 }],
    },
    {
      property: {
        id: "6627617162c199997115cd9d",
        country: "United States",
        state: "CA",
        city: "brea",
        street1: "1355 hazelwood pl",
        street2: "",
        zip: "92821",
        year: 1963,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 1732,
        value: 999990,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [{ owner: dbUsers[9].id, amount: 75, listed: 25 }],
    },
    {
      property: {
        id: "6627628162c199997115cda5",
        country: "United States",
        state: "CA",
        city: "brea",
        street1: "1051 site dr",
        street2: "SPACE 31",
        zip: "92821",
        year: 2004,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 1680,
        value: 235000,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [{ owner: dbUsers[9].id, amount: 50, listed: 50 }],
    },
    {
      property: {
        id: "6627630962c199997115cdab",
        country: "United States",
        state: "CA",
        city: "brea",
        street1: "811 carlson dr",
        street2: "",
        zip: "92821",
        year: 1962,
        propType: "Residential",
        propSubtype: "Single Family",
        size: 1555,
        value: 899999,
        income: 0,
        expense: 0,
        tokensMinted: 100,
        tokensforSale: null,
      },
      users: [{ owner: dbUsers[9].id, amount: 25, listed: 75 }],
    },
  ];

  interface TokensToCreate {
    userId: string;
    numberOfTokens: number;
    listed?: boolean;
    dateListed?: Date;
  }

  for (const property of properties) {
    let tokensForSale = 0;
    let tokensToCreate: TokensToCreate[] = [];
    for (const user of property.users) {
      tokensForSale += user.listed;
      let date = null;
      if (property.users.indexOf(user) > 0) {
        date = new Date(-1);
      } else {
        date = new Date();
      }
      if (user.amount > 0 && user.listed > 0) {
        tokensToCreate.push({
          userId: user.owner,
          numberOfTokens: user.amount,
        });
        tokensToCreate.push({
          userId: user.owner,
          numberOfTokens: user.listed,
          listed: true,
          dateListed: date,
        });
      } else if (user.amount > 0) {
        tokensToCreate.push({
          userId: user.owner,
          numberOfTokens: user.amount,
        });
      } else {
        tokensToCreate.push({
          userId: user.owner,
          numberOfTokens: user.listed,
          listed: true,
          dateListed: date,
        });
      }
    }

    property.property.tokensforSale = tokensForSale;

    const newProperty = await prisma.property.create({
      data: {
        ...property.property,
        tokens: {
          createMany: {
            data: tokensToCreate,
          },
        },
      },
    });

    console.log("Created new property with id:", newProperty.id);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
