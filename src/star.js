const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

let page = 1;

const getData = () => {
  console.log(page);
  return fetch(
    `https://api.github.com/users/exposir/starred?page=${page}&per_page=100`
  );
};

const map = {};

const loading = async () => {
  const data = await getData();
  const res = await data.json();

  if (res.length === 0) {
    return false;
  }

  res.forEach((item) => {
    if (!map[item.language]) {
      map[item.language] = [];
    }
    map[item.language].push(item);
  });

  return true;
};

const read = async () => {
  const flag = await loading();
  if (flag) {
    page++;
    await read();
  }
};

const filePath = path.resolve(__dirname, `../README.md`);
const docs = ["# Star \n\n"];

const write = () => {
  for (i in map) {
    const language = i;
    const item = map[i];

    docs.push(`## ${language} \n\n`);
    item.forEach((i) => {
      docs.push(`- [${i.name}](${i.html_url}) \n`);
    });
  }
  fs.writeFile(filePath, docs.join(""), function (err) {
    if (err) {
      return console.error(err);
    }
  });
};

const start = async () => {
  await read();
  write();
};

start();
