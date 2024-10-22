<template>
  <div class="shortcut__content box__padding--lr20">
    <slot/>
    <div class="footer__btn-group">
      <div class="footer__btn-group--left">
        <div class="footer__btn" @click="downloadHtmlFile">
          <SvgIcon iconName="icon-xiazai" />
          <span class="btnName">下载</span>
        </div>
        <div class="footer__btn" @click="clickFileDom" v-if="props.isShowUpLoadBtn">
          <input type="file" name="上传" id="shortCutUploadInput"/>
          <SvgIcon iconName="icon-shangchuan" />
          <span class="btnName">上传</span>
        </div>
      </div>
      <div class="shortcut__add" @click="openAddShortcutModal" v-if="props.isShowAddShortcut">
        <SvgIcon iconName="icon-add" />
        <span class="btnName">添加导航</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { siteCustomStore } from '@/stores';

// 引入数据存储
const site = siteCustomStore();
// 定义props
const props = defineProps({
  isShowAddShortcut: {
    type: Boolean,
    default: true
  },
  isShowUpLoadBtn: {
    type: Boolean,
    default: true
  },

});
// 定义一个常量，存储 script 标签的 id
const scriptDataId: string = 'json-script';
// 下载导航文件
function downloadHtmlFile() {
  // 定义一个包含 HTML 内容的字符串
  const htmlStr: string = `
    <!DOCTYPE html> <!-- 声明文档类型为 HTML -->
    <html lang="en"> <!-- 设置语言为英语 -->

      <head>
        <meta charset="UTF-8"> <!-- 设置字符编码为 UTF-8 -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- 适配不同设备的视口设置 -->
        <title>导航集合</title> <!-- 网页标题 -->
      </head>

      <body>
        <!-- 网页主体部分，当前为空 -->
      </body> 
      <script id="${scriptDataId}" type="application/json"> 
        ${JSON.stringify(site.categoryDataList)} 
      <\/script>
      
      <script> 
        // 另一个 script 标签，用于处理 JSON 数据
        // 获取刚刚插入的 script 标签
        const jsonDom = document.querySelector("#${scriptDataId}");
        // 获取 script 标签中的文本内容（JSON 字符串）
        const jsonStr = jsonDom.innerText;
        // 将 JSON 字符串解析为 JavaScript 对象
        const jsonData = JSON.parse(jsonStr);
        // 打印解析后的数据到控制台
        console.log('jsonData', jsonData);

        // 获取网页的主体部分
        const bodyDom = document.querySelector("body");

        // 定义一个函数，用于生成网站链接的 HTML
        function getWebsiteDataListDom(websiteDataList) {
          // 初始化一个空字符串，用于存放生成的 HTML
          let htmlStr = "";
          // 遍历传入的每个网站数据项
          websiteDataList.forEach(item => {
            // 为每个网站生成一个列表项的 HTML，并拼接到 htmlStr 中
            htmlStr +=
              \`
                <dd><a href="\${item.url}" target="_blank">\${item.name}</a></dd>
              \`
          });
          // 返回生成的 HTML 字符串
          return htmlStr;
        }

        // 遍历解析后的数据
        jsonData.forEach(item => {
          // 将每个分类和对应的网站链接添加到网页主体中
          bodyDom.innerHTML +=
            \`
              <dl>
                <dt>
                  <h2>\${item.categoryName}</h2> <!-- 分类名称 -->
                </dt>
                \${getWebsiteDataListDom(item.websiteDataList)} <!-- 获取该分类下的网站链接 -->
              </dl>
            \`
        });
      <\/script> <!-- 结束脚本 -->
    <\/html>
  `;

  // 创建一个 Blob 对象，将 HTML 字符串封装成一个可下载的文件
  const htmlStrBolo = new Blob([htmlStr], { type: 'text/html' });
  // 创建一个指向 Blob 对象的 URL
  const htmlStrUrl = URL.createObjectURL(htmlStrBolo);

  // 创建一个链接元素
  const aLink = document.createElement('a');
  // 设置链接的 href 属性为刚刚生成的 URL
  aLink.href = htmlStrUrl;
  // 设置下载文件的名称
  aLink.download = '导航下载文件.html';
  // 触发链接的点击事件，开始下载
  aLink.click();
  // 释放之前创建的 URL 对象，释放内存
  URL.revokeObjectURL(htmlStrUrl);
}

onMounted(() => {
  document.querySelector('#shortCutUploadInput')?.addEventListener('change', uploadHtmlFile);
});

onBeforeUnmount(() => {
  document.querySelector('#shortCutUploadInput')?.removeEventListener('change', uploadHtmlFile);
});

function uploadHtmlFile(this: HTMLInputElement, event: Event) {
  if (this.files) {
    const fileReader = new FileReader();
    fileReader.readAsText(this.files![0] as Blob);
    fileReader.onload = function (res) {
      if (typeof fileReader.result === 'string') {
        // const reg = /id="json-script".*?>(.*?)<\/script>/s;
        // const dataStr = fileReader.result.match(reg)?.[1];
        // 使用DOMParser比正则稍微可读性强一点
        const dParser = new DOMParser();
        const doc = dParser.parseFromString(fileReader.result,"text/html");
        const dataStr = (doc.querySelector("#json-script") as HTMLElement)?.innerText;
        console.log('dataStr', dataStr);
        if (dataStr) {
          const newCategoryDataList = JSON.parse(dataStr);
          console.log(newCategoryDataList);
          site.setCategoryDataList(newCategoryDataList);
        }
      }
    };
  }
}
// 上传文件
function clickFileDom() {
  const fileDom: HTMLInputElement | null = document.querySelector('#shortCutUploadInput');
  if (fileDom) {
    fileDom.click();
  } else {
    console.warn('元素不存在');
  }
}
// 打开添加导航
const emit = defineEmits(["openAddShortcutModal"])
function openAddShortcutModal() {
  emit("openAddShortcutModal");
}
</script>

<style lang="scss" scoped>
.shortcut__content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .footer__btn-group {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 15px 0;
    .footer__btn-group--left {
      grid-column: 1 / 2;
      display: flex;

      #shortCutUploadInput {
        display: none;
      }
      div + div {
        margin-left: 10px;
      }
    }
    .shortcut__add {
      width: 240px;
      height: 40px;
      justify-self: center;
      border-radius: 8px;
      background-color: var(--main-background-light-color);
      line-height: 40px;
      text-align: center;
      cursor: pointer;
    }
  }
  .btnName {
    margin-left: 5px;
  }
}
</style>
