'use strict';
const fs = require('fs-extra');
const path = require('path');
const Mustache = require('mustache');

exports.copyTemplate = async function copyTemplate(appPath, appName) {
  await creatModal(appName, appPath);
};

async function creatModal(appName = 'default', appPath) {
  const result = await getFileByNameUseDefaultStrategy('template'); // await fs.existsSync('template')
  if (!result) {
    console.error('模板文件夹不存在');
    return false;
  }
  console.log('template path is ', result.path);
  const crarc = await getFileByNameUseDefaultStrategy('.crarc'); // await fs.existsSync(`.modelrc`)
  if (!crarc) {
    console.error('请配置model模版 crarc');
    return false;
  }
  console.log('.crarc path is ', crarc.path);

  let tpl = require(crarc.path);
  tpl.namespace = appName;
  await copyDir(result.path, appPath);
  console.log('replace files ...', JSON.stringify(tpl, 0, 2));
  await allRead(appPath, tpl);
  console.log(`模块${appName}创建成功 ${appPath}`);
}

// 使用相同策略获取获取文件
async function getFileByNameUseDefaultStrategy(fileName) {
  if (!fileName) {
    return null;
  }

  // 当前命令运行目录下的
  let reuslt = await checkFileExistReturn(
    path.join(process.cwd(), `../${fileName}`)
  );
  if (reuslt) {
    return reuslt;
  }

  // 全局默认路径
  reuslt = await checkFileExistReturn(
    path.join(process.env.HOME || process.env.HOMEPATH, fileName)
  );
  if (reuslt) {
    return reuslt;
  }

  // 包中默认模版
  reuslt = await checkFileExistReturn(
    path.join(__dirname, `../../${fileName}`)
  );
  if (reuslt) {
    return reuslt;
  }

  return null;
  async function checkFileExistReturn(path) {
    if (await fs.existsSync(path)) {
      return { path };
    }
    return null;
  }
}

// 复制文件夹
async function copyDir(oldPath, newPath) {
  try {
    await fs.copy(oldPath, newPath);
  } catch (error) {
    console.log(error);
  }
}

// 模版替换函数
async function allRead(filePath, tpl) {
  try {
    const result = await fs.readdirSync(filePath);
    for (const fileName of result) {
      var filedir = path.join(filePath, fileName);
      if (/node_modules|.jpg$|.png$/.test(filedir)) {
        continue;
      }
      var stats = fs.statSync(filedir);
      var isFile = stats.isFile(); // 是文件
      var isDir = stats.isDirectory(); // 是文件夹
      if (isFile) {
        await allReplace(filedir, tpl);
      }
      if (isDir) {
        await allRead(filedir, tpl);
      }
    }
    // result.forEach(fileName => {
    //   var filedir = path.join(filePath, fileName)
    //   var stats = fs.statSync(filedir)
    //   var isFile = stats.isFile() // 是文件
    //   var isDir = stats.isDirectory() // 是文件夹
    //   if (isFile) {
    //     allReplace(filedir, tpl)
    //   }
    //   if (isDir) {
    //     allRead(filedir, tpl)
    //   }
    // })
  } catch (err) {
    console.log(err);
  }
}

// 创建modal
async function allReplace(path, tpl) {
  var data = await fs.readFileSync(path, 'utf8');
  var customTags = ['{@', '@}'];
  try {
    var output = Mustache.render(data, tpl, {}, customTags);
    await fs.writeFileSync(path, output, 'utf8');
  } catch (error) {
    return;
  }
}
