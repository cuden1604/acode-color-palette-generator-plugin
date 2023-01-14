import plugin from "../plugin.json";

const alert = acode.require("alert");
const loader = acode.require("loader");
import copy from "copy-to-clipboard";
class colorpalette {
  async init($page) {
    let command = {
      name: "Color Palette",
      description: " Color Palette",
      exec: this.run.bind(this),
    };
    editorManager.editor.commands.addCommand(command);

    $page.id = "acode-plugin-colorpalette";
    $page.settitle("Colour Palette Generator");
    this.$page = $page;

    this.$main = tag("main", {
      className: "main",
    });

    this.$page.append(this.$main);

   this.$main.style.height = "100%";
    this.$main.style.display = "flex";
    this.$main.style.flexDirection = "column";
   //  this.$main.style.justifyContent="center"
   this.$main.style.alignItems = "center";
    // this.$main.style.overflowY = "scroll"

    this.$heading = tag("h1", {
      textContent: "Colour Palette Generator",
    });

    this.$main.append(this.$heading);
    this.$heading.style.margin = "8px";

    this.$form = tag("form", {
      className: "form",
      enctype: "multipart/form-data",
    });

    this.$main.append(this.$form);
    this.$form.style.justifyContent = "flexStart";


    this.$file = tag("input", {
      type: "file",
      className: "file",
      name: "file",
    });

    this.$file.style.width = "90%";
    this.$file.style.padding = "8px";
    this.$form.append(this.$file);

    this.$colors = tag("div", {
      className: "colorBox",
      textContent: "",
    });
    this.$main.append(this.$colors);
    this.$colors.style.display = "flex";
    this.$colors.style.flexDirection = "row";
    this.$colors.style.flexWrap = "wrap";
    this.$colors.style.justifyContent = "center";
  //  this.$colors.style.alignItems = "center";
    this.$colors.style.margin = "7px";
    this.$colors.style.fontSize = "19px";
   this.$colors.style.height = "85%";
   this.$colors.style.width = "100%";

    this.$colors.style.overflowY = "scroll";

  }

  async run() {

    this.$page.show();
    
    const fileData = document.querySelector(".file");

function insert(src) {
      const colorBox = document.querySelector(".colorBox");

      const card = document.createElement("div");
      
      const html = `
      <div style="background:${src};width:120px;border:1px solid ${src};border-radius:8px;height:100px;padding-bottom:3px"></div>
      <div class="colorName" style="padding:2px;aligin-self:flex-end">${src}</div>
     `
      card.classList.add("card");
      card.style.border = `1px solid ${src}`;
      card.style.height = "120px";
      card.style.width = "120px";
      card.style.textAlign = "center";
      card.style.margin= "5px";
      card.style.borderRadius = "7px";
      card.style.display = "flex"
      card.style.flexDirection = "column"
      card.style.alignItems = "center"
card.insertAdjacentHTML("afterbegin",
          html);
      colorBox.appendChild(card);
    }
    
    insert("#82AAE3")
    insert("#91D8E4")
    insert("#BFEAF5")
    insert("#EAFDFC")
    insert("#4d3cab")
    
    
    fileData.addEventListener("change", () => {
      const file = fileData.files;
      const data = new FormData();
      // alert(file[0])
      data.append("file", file[0]);

      loader.create("loading", "Generating Colour");

      fetch("https://image-color-extractor-a84a.onrender.com/getColor", {
        method: "POST",
        body: data,
      })
        .then((r) => r.json())
        .then((data) => {
          
          loader.destroy();
          const res = document.querySelector(".colorBox");
          const colorArr = Array.from(data);
          res.innerText = " ";
          for (let i = 0; i < colorArr.length; i++) {
            // alert(colorArr[i])
            insert(colorArr[i]);
          }

          const colourOut = Array.from(document.querySelectorAll(".card"));

         // alert(colourOut);

          colourOut.forEach((e) => {
            const color = e.innerText;
            e.addEventListener("click", (event) => {
              copy(color);
              alert("Colour copied to clipboard")
            });
          });
        });
        
    });
    
    this.$page.onhide = () => {
const colorBox = document.querySelector(".colorBox");
colorBox.innerHTML = " ";

        }
  }

  async destroy() {
    let command = {
      name: "Color Palette",
      description: "Color Palette",
      exec: this.run.bind(this),
    };
    editorManager.editor.commands.removeCommand(command);
  }
}

if (window.acode) {
  const acodePlugin = new colorpalette();
  acode.setPluginInit(
    plugin.id,
    (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
      if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
      }
      acodePlugin.baseUrl = baseUrl;
      acodePlugin.init($page, cacheFile, cacheFileUrl);
    }
  );
  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}
