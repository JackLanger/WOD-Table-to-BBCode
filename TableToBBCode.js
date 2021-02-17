// ==UserScript==
// @name         Table to BBCode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Create a Table without writing BBCode
// @author       Jack
// @match        http*://*.world-of-dungeons.*/wod/spiel/forum/viewtopic.*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const empty = document.createElement("BR");
  var isActive = false;
  var _Rows, _Columns;

  class tableMember{
    id;
    value;
    isBold;
    isUnderlined;
    isHeader;
    parent;

    constructor(id,parent){
      this.id = id;
      this.parent = parent;

      addTextbox(id,parent);
    }

    update(value, bold,underlined,header){
      this.value = value;
      this.isBold = bold;
      this.isUnderlined =underlined;
      this.isHeader = header;
    }

    toString(){
      let output = this.value;
      if(this.isHeader){
        output = "[b][u]"+this.value+"[/u][/b]";
      }else{
        if(this.isBold){
          output = "[b]"+this.value+"[/b]";
        }
        if(this.isUnderlined){
          output = "[u]"+this.value+"[/u]";
        }
      }
      return output
    }
  }

  var linkList = document.querySelector(".boardcon1.right");
  var tableCreatorLink = document.createElement("A");
  linkList.appendChild(empty);
  linkList.appendChild(tableCreatorLink);
  tableCreatorLink.style.marginRight = "8px";
  tableCreatorLink.innerText = "Tabelle";
  tableCreatorLink.style.color = "#FFCF00";
  tableCreatorLink.style.cursor = "pointer";
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
    const rows = document.createElement("input");
    const columns = document.createElement("input");
    const rowsLable = document.createElement("lable");
    const columnsLable = document.createElement("lable");
    const createTableButton = document.createElement("BUTTON");
    const convertButton = document.createElement("BUTTON");
    const deleteTableButton = document.createElement("BUTTON");
    const table = document.createElement("table");

    tableContainer.style.display = "none";
    tableContainer.style.margin = "0.5em";
    rowsLable.innerText = "rows: ";
    columnsLable.innerText = "columns: ";

    // setup the buttons
    rows.innerHTML = "add Row";
    columns.innerHTML = "add Column";
    createTableButton.innerHTML = "Erstellen";
    deleteTableButton.innerHTML = "reset";
    createTableButton.className = "button clickable";
    deleteTableButton.className = "button clickable";
    deleteTableButton.style.marginLeft = "0.5em";
    convertButton.innerHTML = "Convert";
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
    //table.style.border = "solid 2px #777";
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

      for (let r = 0; r < _Rows; r++) {
        tablebody += "[tr]";
        for (let c = 0; c < _Columns; c++) {
          let selector = "#tb" + r + "" + c;
          let inputValue = document.querySelector(selector).value;
          tablebody += `[td]${inputValue}[/td]`;
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
          let column = tableRow.appendChild(document.createElement("TD"));
          new tableMember(`tb${r}${c}`, column);
        }
      }
    });

    deleteTableButton.addEventListener("click", (e) => {
      e.preventDefault();
      Array.from(table.childNodes[0].children).forEach((child) => {
        table.childNodes[0].remove(child);
      });
    });
  }

  function addTextbox(name, parent) {
    var tb = document.createElement("input");
    tb.id = id;
    parent.appendChild(tb);
  }
})();
