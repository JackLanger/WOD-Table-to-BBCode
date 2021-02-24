// ==UserScript==
// @name         Table to BBCode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Create a Table without writing BBCode
// @author       Jack Langer
// @match        http*://*.world-of-dungeons.*/wod/spiel/forum/viewtopic.*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const empty = document.createElement("BR");
  var isActive = false;
  var _Rows, _Columns;

  class optionsBuilder {
    bold;
    underlined;
    header;
    isExpanded;
    parent;
    div;
    id;

    constructor(parent, id) {
      this.parent = parent;
      this.id = id;
      
      this.setup();
      
      this.createBuilderVisuals(id);

      this.div.onmouseover = () => {
        this.expandOptionsMenu();
      };
      this.div.onmouseout = () => {
        this.shrinkOptionsMenu();
      };
      
    }

    createBuilderVisuals(id){
      //#region container
      this.div = document.createElement("DIV");
      this.parent.appendChild(this.div);
      this.div.style.color = "#ffcf00";
      this.div.style.height = ".5em";
      this.div.style.width = ".5em";
      this.div.style.background = "#888";
      this.div.style.border = "solid 2px";
      this.div.style.position = "absolute";
      this.div.style.zIndex = 3;
      this.div.id = id;
      this.div.style.cursor = "pointer";
      this.div.style.overflow = "hidden";
      //#endregion
      let boldCheckBox = document.createElement("input");
      let underlineCheckBox = document.createElement("input");
      let headerCheckBox = document.createElement("input");
      
      let lableBold = document.createElement("p");
      let lableUnderline = document.createElement("p");
      let lableHead = document.createElement("p");

      lableBold.innerText = "b";
      lableUnderline.innerText = "u";
      lableHead.innerText = "h";
      
      boldCheckBox.setAttribute("type", "checkbox");
      boldCheckBox.id = `${id}-bold`;

      underlineCheckBox.setAttribute("type", "checkbox");
      underlineCheckBox.id = `${id}-underline`;

      headerCheckBox.setAttribute("type", "checkbox");
      headerCheckBox.id = `${id}-header`;
      let container = document.createElement('DIV');
      this.div.appendChild(container);
      container.appendChild(lableBold);
      lableBold.appendChild(boldCheckBox);
      container.appendChild(lableUnderline);
      lableUnderline.appendChild(underlineCheckBox);
      container.appendChild(lableHead);
      lableHead.appendChild(headerCheckBox);
      container.style.margin = "auto";
    }


    expandOptionsMenu(){    
      this.isExpanded = true;
      this.div.style.width = "auto";
      this.div.style.height = "auto";
      this.div.background = "#aaa";
      this.div.border = "solid 1px";
      this.div.style.zIndex = 4;
    }

    shrinkOptionsMenu(){
      this.div.style.width = "0.5em";
      this.div.style.height = "0.5em";
      this.div.style.zIndex = 3;
      this.update();
    }

    update(){
      this.bold = document.querySelector(`#${this.id}-bold`).checked;
      this.underlined = document.querySelector(`#${this.id}-underline`).checked;
      this.header = document.querySelector(`#${this.id}-header`).checked;
    }
    setup() {
      this.isExpanded = false;
      console.log(this.div);
      this.bold = false;
      this.underlined = false;
      this.header = false;
    }
  }

  class tableMember {
    id;
    value;
    isBold;
    isUnderlined;
    isHeader;
    parent;
    row;
    column;
    optionsBuilder;

    constructor(row, col, parent) {
      this.id = `tb${row}${col}`;
      this.parent = parent;
      this.row = row;
      this.column = col;

      addTextbox(this.id, parent, `op${row}${col}`);
      this.optionsBuilder = new optionsBuilder(parent,"op"+this.id);
    }

    update(bold, underlined, header) {
      this.value = document.querySelector(`#${this.id}`).value;
      this.isBold = this.optionsBuilder.bold;
      this.isUnderlined = this.optionsBuilder.underlined;
      this.isHeader = this.optionsBuilder.header;
    }

    toString() {
      let output = this.value;
      if (this.isHeader) {
        output = "[size=14][b][u]" + this.value + "[/u][/b][/size]";
      } else {
        if (this.isBold) {
          output = "[b]" + this.value + "[/b]";
        }
        if (this.isUnderlined) {
          output = "[u]" + this.value + "[/u]";
        }
      }
      return output;
    }
  }
  var tableMembers = [];
  var linkList = document.querySelector(".boardcon1.right");
  var tableCreatorLink = createElement("A","Tabelle");
  
  linkList.appendChild(empty);
  linkList.appendChild(tableCreatorLink);

  tableCreatorLink.style.marginRight = "8px";
  tableCreatorLink.style.color = "#FFCF00";
  tableCreatorLink.style.cursor = "pointer";

  //events
  tableCreatorLink.onmouseover = () => {
    tableCreatorLink.style.color = "#fff";
  };
  tableCreatorLink.onmouseout = () => {
    tableCreatorLink.style.color = "#FFCF00";
  };

  createTableContainer();

  tableCreatorLink.onclick = () => {
    isActive = isActive ? false : true;
    let table = document.querySelector("#table-container");

    table.style.display = isActive ? "none" : "block";
  };

  function createTableContainer() {
    //logic for creating new elements
    isActive = true;

    const board = document.querySelector("textarea");
    const tableContainer = document.createElement("DIV");
    const rows = createElement("input","add row");
    const columns = createElement("input","add column");
    const rowsLable = createElement("lable","rows: ");
    const columnsLable = createElement("lable","columns: ");
    const createTableButton = createElement("BUTTON","Erstellen");
    const convertButton = createElement("BUTTON","Convert");
    const deleteTableButton = createElement("BUTTON","reset");
    const table = document.createElement("table");

    tableContainer.style.display = "none";
    tableContainer.style.margin = "0.5em";

    // setup the buttons
    createTableButton.className = "button clickable";
    deleteTableButton.className = "button clickable";
    deleteTableButton.style.marginLeft = "0.5em";
    convertButton.className = "button clickable";
    rows.id = "rows";
    columns.id = "columns";
    rows.style.width = "1.5em";
    rows.style.marginRight = "1em";
    rows.style.textAlign = "center";
    columns.style.textAlign = "center";
    columns.style.marginRight = "1em";
    columns.style.width = "1.5em";
    table.id = "converter-table";
    table.style.minHeight = "1em";
    table.style.width = "auto";
    table.style.padding = ".5em";
    table.style.margin = ".5em";

    var tableElements = [
      rowsLable,
      rows,
      columnsLable,
      columns,
      createTableButton,
      deleteTableButton,
      table,
      convertButton,
      document.createElement("HR"),
    ];

    tableContainer.id = "table-container";

    board.parentElement.prepend(tableContainer);

    tableElements.forEach((elem) => {
      tableContainer.appendChild(elem);
    });

    convertButton.addEventListener("click", (e) => {
      e.preventDefault();
      var tablebody = "[table border=2]\n";
      let index = 0;
      for (let r = 0; r < _Rows; r++) {
        tablebody += "[tr]";
        //loop through table members and create the output
        for (let c = 0; c < _Columns; c++) {
          console.log(tableMembers[index].optionsBuilder);
          tableMembers[index].update(false, false, false);
          tablebody += `[td]${tableMembers[index].toString()}[/td]`;
          index++;
        }
        tablebody += "[/tr]\n";
      }

      tablebody += "[/table]";

      console.log(tablebody);
      if (!board.value == "") {
        board.value += "\n\n";
        board.value += tablebody + "\n\n";
      } else {
        board.value += tablebody;
      }
    });

    createTableButton.addEventListener("click", (e) => {
      e.preventDefault();
      var rowCount, colCount;
      try {
        rowCount = parseInt(rows.value);
        colCount = parseInt(columns.value);
      } catch {
        _Rows = 0;
        _Columns = 0;
      }

      _Rows = rowCount;
      _Columns = colCount;
      rows.value = 0;
      columns.value = 0;

      for (let r = 0; r < rowCount; r++) {
        let tableRow = table.insertRow();
        for (let c = 0; c < colCount; c++) {
          let td = document.createElement("TD");
          let column = tableRow.appendChild(td);

          var member = new tableMember(r, c, column);
          tableMembers.push(member);
          member.update();
        }
      }
    });

    deleteTableButton.addEventListener("click", (e) => {
      e.preventDefault();
      Array.from(table.childNodes[0].children).forEach((child) => {
        table.childNodes[0].remove(child);
      });
      tableMembers = [];
    });
  }
/**
 * create an input field as well as a container and append the input to the container before appending the container to the given parent
 * @param {string} id  
 * @param {*} parent 
 */
  function addTextbox(id, parent) {
    var tb = document.createElement("input");
    let div = document.createElement("DIV");
    tb.id = id;
    parent.appendChild(div);
    div.appendChild(tb);
  }
  /**
   * creates a new div element and appends it as child to a parent container
   * @param {object} parent the container to act as a parent for a new div element
   */
  function addDiv(parent){
    var div = document.createElement("DIV");
    parent.appendChild(div);
    return div;
  }
  /**
   * Helper class for creating elements with content
   * @param {string} elem describes the element to be created i.e "BUTTON"
   * @param {string} content  content to be set as innerHTML
   */
  function createElement(elem,content){
    var elem = document.createElement(elem);
    elem.innerHTML = content;
    return elem;
  }
})();
