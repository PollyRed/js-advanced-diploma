!function(e){var t={};function a(s){if(t[s])return t[s].exports;var i=t[s]={i:s,l:!1,exports:{}};return e[s].call(i.exports,i,i.exports,a),i.l=!0,i.exports}a.m=e,a.c=t,a.d=function(e,t,s){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(a.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)a.d(s,i,function(t){return e[t]}.bind(null,i));return s},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a(a.s=1)}([function(e,t,a){},function(e,t,a){"use strict";a.r(t);a(0);class s{constructor(){this.boardSize=8,this.container=null,this.boardEl=null,this.cells=[],this.cellClickListeners=[],this.cellEnterListeners=[],this.cellLeaveListeners=[],this.newGameListeners=[],this.saveGameListeners=[],this.loadGameListeners=[]}bindToDOM(e){if(!(e instanceof HTMLElement))throw new Error("container is not HTMLElement");this.container=e}drawUi(e){this.checkBinding(),this.container.innerHTML='\n      <div class="controls">\n        <button data-id="action-restart" class="btn">New Game</button>\n        <button data-id="action-save" class="btn">Save Game</button>\n        <button data-id="action-load" class="btn">Load Game</button>\n      </div>\n      <div class="board-container">\n        <div data-id="board" class="board"></div>\n      </div>\n    ',this.newGameEl=this.container.querySelector("[data-id=action-restart]"),this.saveGameEl=this.container.querySelector("[data-id=action-save]"),this.loadGameEl=this.container.querySelector("[data-id=action-load]"),this.newGameEl.addEventListener("click",e=>this.onNewGameClick(e)),this.saveGameEl.addEventListener("click",e=>this.onSaveGameClick(e)),this.loadGameEl.addEventListener("click",e=>this.onLoadGameClick(e)),this.boardEl=this.container.querySelector("[data-id=board]"),this.boardEl.classList.add(e);for(let e=0;e<this.boardSize**2;e+=1){const s=document.createElement("div");s.classList.add("cell","map-tile","map-tile-"+(t=e,a=this.boardSize,0===t?"top-left":t===a-1?"top-right":t>0&&t<a-1?"top":t===a*a-a?"bottom-left":t%a==0?"left":t===a*a-1?"bottom-right":t>a*a-a&&t<a*a-1?"bottom":(t+1)%a==0?"right":"center")),s.addEventListener("mouseenter",e=>this.onCellEnter(e)),s.addEventListener("mouseleave",e=>this.onCellLeave(e)),s.addEventListener("click",e=>this.onCellClick(e)),this.boardEl.appendChild(s)}var t,a;this.cells=Array.from(this.boardEl.children)}redrawPositions(e){for(const e of this.cells)e.innerHTML="";for(const a of e){const e=this.boardEl.children[a.position],s=document.createElement("div");s.classList.add("character",a.character.type);const i=document.createElement("div");i.classList.add("health-level");const r=document.createElement("div");r.classList.add("health-level-indicator","health-level-indicator-"+((t=a.character.health)<15?"critical":t<50?"normal":"high")),r.style.width=a.character.health+"%",i.appendChild(r),s.appendChild(i),e.appendChild(s)}var t}addCellEnterListener(e){this.cellEnterListeners.push(e)}addCellLeaveListener(e){this.cellLeaveListeners.push(e)}addCellClickListener(e){this.cellClickListeners.push(e)}addNewGameListener(e){this.newGameListeners.push(e)}addSaveGameListener(e){this.saveGameListeners.push(e)}addLoadGameListener(e){this.loadGameListeners.push(e)}onCellEnter(e){e.preventDefault();const t=this.cells.indexOf(e.currentTarget);this.cellEnterListeners.forEach(e=>e.call(null,t))}onCellLeave(e){e.preventDefault();const t=this.cells.indexOf(e.currentTarget);this.cellLeaveListeners.forEach(e=>e.call(null,t))}onCellClick(e){const t=this.cells.indexOf(e.currentTarget);this.cellClickListeners.forEach(e=>e.call(null,t))}onNewGameClick(e){e.preventDefault(),this.newGameListeners.forEach(e=>e.call(null))}onSaveGameClick(e){e.preventDefault(),this.saveGameListeners.forEach(e=>e.call(null))}onLoadGameClick(e){e.preventDefault(),this.loadGameListeners.forEach(e=>e.call(null))}static showError(e){alert(e)}static showMessage(e){alert(e)}selectCell(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"yellow";this.deselectCell(e),this.cells[e].classList.add("selected","selected-"+t)}deselectCell(e){const t=this.cells[e];t.classList.remove(...Array.from(t.classList).filter(e=>e.startsWith("selected")))}showCellTooltip(e,t){this.cells[t].title=e}hideCellTooltip(e){this.cells[e].title=""}showDamage(e,t){return new Promise(a=>{const s=this.cells[e],i=document.createElement("span");i.textContent=t,i.classList.add("damage"),s.appendChild(i),i.addEventListener("animationend",()=>{s.removeChild(i),a()})})}setCursor(e){this.boardEl.style.cursor=e}checkBinding(){if(null===this.container)throw new Error("GamePlay not bind to DOM")}}var i={prairie:"prairie",desert:"desert",arctic:"arctic",mountain:"mountain"};class r{constructor(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"generic";if(this.level=e,this.attack=0,this.defence=0,this.health=100,this.type=t,"Character"===new.target.name)throw new Error('Character cannot be created with operator "new"')}levelUp(){this.level+=1,this.attack=Math.floor(Math.max(this.attack,this.attack*(1.8-this.health/100))),this.defence=Math.floor(Math.max(this.defence,this.defence*(1.8-this.health/100))),this.health+=80,this.health>100&&(this.health=100)}}class n extends r{constructor(e){super(e,arguments.length>1&&void 0!==arguments[1]?arguments[1]:"bowman"),this.attack=25,this.defence=25}}class l extends r{constructor(e){super(e,arguments.length>1&&void 0!==arguments[1]?arguments[1]:"swordsman"),this.attack=40,this.defence=10}}class o{constructor(){this.teamMembers=[]}addMember(e){this.teamMembers.push(e)}}class c{constructor(e,t){if(!(e instanceof r))throw new Error("character must be instance of Character or its children");if("number"!=typeof t)throw new Error("position must be a number");this.character=e,this.position=t}}function h(e,t){return Math.floor(Math.random()*(t-e)+e)}function*d(e,t){const a=e[h(0,e.length)];yield new a(h(1,t))}function m(e,t,a){const s=[];for(;s.length<e;){const e=a(t);-1===s.indexOf(e)&&s.push(e)}return s}function u(e,t,a,s){const i=function(e,t,a){const s=new o;for(let i=0;i<a;i+=1)s.addMember(d(e,t).next().value);return s}(e,t,a),r=[];for(let e=0;e<i.teamMembers.length;e+=1)r.push(new c(i.teamMembers[e],s[e]));return r}class g{constructor(){this.currentLevel=1,this.isPlayerTurn=!0,this.selectedCell=-1,this.selectedCharacter=null,this.computerMoveDirection=-1,this.positions=[],this.scores=0}}const f=[n,class extends r{constructor(e){super(e,arguments.length>1&&void 0!==arguments[1]?arguments[1]:"magician"),this.attack=10,this.defence=40}},l],p=[class extends r{constructor(e){super(e,arguments.length>1&&void 0!==arguments[1]?arguments[1]:"daemon"),this.attack=10,this.defence=40}},class extends r{constructor(e){super(e,arguments.length>1&&void 0!==arguments[1]?arguments[1]:"undead"),this.attack=40,this.defence=10}},class extends r{constructor(e){super(e,arguments.length>1&&void 0!==arguments[1]?arguments[1]:"vampire"),this.attack=25,this.defence=25}}];function C(e){return Math.floor(Math.random()*e)*e+Math.round(Math.random())}function S(e){return Math.floor(Math.random()*e)*e+Math.round(Math.random()+e-2)}class v{constructor(e,t){this.gamePlay=e,this.stateService=t,this.gameState=new g}init(){this.gameState=new g,this.changeLevel(),this.addListeners()}drawLevel(){let e;1===this.gameState.currentLevel&&(e=i.prairie),2===this.gameState.currentLevel&&(e=i.desert),3===this.gameState.currentLevel&&(e=i.arctic),4===this.gameState.currentLevel&&(e=i.mountain),this.gamePlay.drawUi(e)}changeLevel(){let e=[],t=[],a=0,s=0;if(1===this.gameState.currentLevel)a=2,s=2;else if(2===this.gameState.currentLevel)a=1,s=2;else if(3===this.gameState.currentLevel)a=2,s=3;else{if(4!==this.gameState.currentLevel)return void alert("You win!");a=2,s=4}const i=m(this.gameState.positions.length+a,this.gamePlay.boardSize,C),r=m(this.gameState.positions.length+a,this.gamePlay.boardSize,S);e=1===this.gameState.currentLevel?u([n,l],s-1,a,i):u(f,s-1,a,i);for(let t=0;t<this.gameState.positions.length;t+=1){const s=this.gameState.positions[t];s.position=i[t+a],s.character.levelUp(),e.push(s)}t=u(p,s,this.gameState.positions.length+a,r),this.drawLevel(),this.gameState.positions=e.concat(t),this.gamePlay.redrawPositions(this.gameState.positions)}addScores(){const e=this.gameState.positions.filter(e=>v.isPlayableCharacter(e));for(const t of e)this.gameState.scores+=t.character.health}getCharacterFromCell(e){for(const t of this.gameState.positions)if(t.position===e)return t;return null}static getCharacterInfo(e){return`🎖${e.level} ⚔${e.attack} 🛡${e.defence} ❤${e.health}`}static isPlayableCharacter(e){return"bowman"===e.character.type||"swordsman"===e.character.type||"magician"===e.character.type}isCharacterCanAttack(e){if(null!=this.gameState.selectedCharacter){const t=this.gamePlay.boardSize,a=this.gameState.selectedCharacter.character.type,s=this.gameState.selectedCharacter.position,i=Math.floor(s/t),r=Math.floor(e/t),n=Math.abs(s%8-e%8);if(s===e)return!1;if("swordsman"===a||"undead"===a)return Math.abs(r-i)<=1&&n<=1&&n>=0&&n<t;if("bowman"===a||"vampire"===a)return Math.abs(r-i)<=2&&n<=2&&n>=0&&n<t;if("magician"===a||"daemon"===a)return Math.abs(r-i)<=4&&n<=4&&n>=0&&n<t}return!1}isCharacterCanMove(e){if(null!=this.gameState.selectedCharacter){const t=this.gamePlay.boardSize,a=this.gameState.selectedCharacter.character.type,s=this.gameState.selectedCharacter.position,i=Math.floor(s/t),r=Math.floor(e/t),n=Math.abs(s%8-e%8);if(s===e)return!1;const l=r===i,o=0===n,c=n===Math.abs(i-r);if(n>=0&&n<t&&(o||l||c)){if("swordsman"===a||"undead"===a)return Math.abs(r-i)<=4&&n<=4;if("bowman"===a||"vampire"===a)return Math.abs(r-i)<=2&&n<=2;if("magician"===a||"daemon"===a)return Math.abs(r-i)<=1&&n<=1}}return!1}static calculateDamage(e,t){return Math.floor(Math.max(e.attack-t.defence,.1*e.attack))}moveRandomComputerPlayer(e){const t=e[Math.floor(Math.random()*e.length)],a=this.gameState.positions.indexOf(t),s=t.position%this.gamePlay.boardSize;let i=!0;return(s-1<0||null!=this.getCharacterFromCell(t.position-1))&&(this.gameState.computerMoveDirection=1,i=!1),!((s+1>=this.gamePlay.boardSize||null!=this.getCharacterFromCell(t.position+1))&&(this.gameState.computerMoveDirection=-1,!i))&&(this.gameState.positions[a].position+=this.gameState.computerMoveDirection,!0)}computerTurn(){const e=this.gameState.positions.filter(e=>!v.isPlayableCharacter(e)),t=this.gameState.positions.filter(e=>v.isPlayableCharacter(e));for(const a of e)for(const e of t)if(this.gameState.selectedCharacter=a,this.isCharacterCanAttack(e.position)){const s=this.gameState.positions.indexOf(e),i=v.calculateDamage(a.character,e.character);return this.gameState.positions[s].character.health-=i,this.gameState.selectedCharacter=null,void this.gamePlay.showDamage(e.position,i).then(()=>{this.gameState.positions[s].character.health<=0&&(this.gameState.selectedCharacter=null,this.gamePlay.deselectCell(e.position),this.gameState.positions.splice(s,1),t.splice(t.indexOf(e),1),0===t.length&&alert("Game Over!")),this.gamePlay.redrawPositions(this.gameState.positions)})}let a=!1;for(;!a;)a=this.moveRandomComputerPlayer(e);this.gamePlay.redrawPositions(this.gameState.positions),this.gameState.selectedCharacter=null,this.gameState.isPlayerTurn=!0}addListeners(){this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this)),this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this)),this.gamePlay.addCellClickListener(this.onCellClick.bind(this)),this.gamePlay.addNewGameListener(this.onNewGame.bind(this)),this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this)),this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this))}onCellClick(e){if(this.gameState.currentLevel>4)return;const t=this.getCharacterFromCell(e);if(this.gameState.isPlayerTurn&&null!==t&&(v.isPlayableCharacter(t)?(this.gameState.selectedCell>=0&&(this.gamePlay.deselectCell(this.gameState.selectedCell),this.gameState.selectedCell=-1),this.gamePlay.selectCell(e),this.gameState.selectedCell=e,this.gameState.selectedCharacter=t):null===this.gameState.selectedCharacter&&s.showError("Это неигровой персонаж!")),this.gameState.isPlayerTurn&&null!==this.gameState.selectedCharacter&&null===t){const t=this.gameState.positions.indexOf(this.gameState.selectedCharacter),a=this.gameState.selectedCharacter.position;this.isCharacterCanMove(e)&&(this.gameState.positions[t].position=e,this.gamePlay.redrawPositions(this.gameState.positions),this.gamePlay.deselectCell(a),this.gameState.selectedCharacter=null,this.computerTurn())}else if(this.gameState.isPlayerTurn&&null!==this.gameState.selectedCharacter&&null!==t){const a=this.gameState.selectedCharacter.position;if(this.isCharacterCanAttack(e)){const s=this.gameState.positions.indexOf(t),i=v.calculateDamage(this.gameState.selectedCharacter.character,t.character);this.gameState.positions[s].character.health-=i,this.gamePlay.showDamage(e,i).then(()=>{if(this.gamePlay.deselectCell(a),this.gameState.selectedCharacter=null,this.gameState.positions[s].character.health<=0){this.gameState.positions.splice(s,1);0===this.gameState.positions.filter(e=>!v.isPlayableCharacter(e)).length&&(this.gameState.currentLevel+=1,this.addScores(),this.changeLevel())}this.gamePlay.redrawPositions(this.gameState.positions),this.computerTurn()})}}}onCellEnter(e){if(this.gameState.currentLevel>4)return;const t=this.getCharacterFromCell(e);if(null!==t){-1!==this.gameState.selectedCell&&this.gameState.selectedCell!==e&&(v.isPlayableCharacter(t)?this.gamePlay.setCursor("pointer"):v.isPlayableCharacter(t)||(this.isCharacterCanAttack(e)?(this.gamePlay.setCursor("crosshair"),this.gamePlay.selectCell(e,"red")):this.gamePlay.setCursor("not-allowed")));const a=v.getCharacterInfo(t.character);this.gamePlay.showCellTooltip(a,e)}else null===t&&-1!==this.gameState.selectedCell&&this.gameState.selectedCell!==e&&(this.isCharacterCanMove(e)?(this.gamePlay.setCursor("pointer"),this.gamePlay.selectCell(e,"green")):this.gamePlay.setCursor("not-allowed"))}onCellLeave(e){this.gameState.currentLevel>4||(this.gamePlay.setCursor("auto"),e!==this.gameState.selectedCell&&this.gamePlay.deselectCell(e),this.gamePlay.hideCellTooltip(e))}onNewGame(){const{scores:e}=this.gameState,t=new s;t.bindToDOM(document.querySelector("#game-container")),this.gamePlay=t,this.init(),this.gameState.scores=e}onSaveGame(){this.stateService.save(this.gameState)}onLoadGame(){try{this.gameState=this.stateService.load();const e=[];for(const t of this.gameState.positions){const a=Object.setPrototypeOf(t.character,r.prototype);e.push(new c(a,t.position))}this.gameState.positions=e,this.drawLevel(),this.gamePlay.redrawPositions(this.gameState.positions)}catch(e){alert("Load failed!")}}}const y=new s;y.bindToDOM(document.querySelector("#game-container"));const L=new class{constructor(e){this.storage=e}save(e){this.storage.setItem("state",JSON.stringify(e))}load(){try{return JSON.parse(this.storage.getItem("state"))}catch(e){throw new Error("Invalid state")}}}(localStorage);new v(y,L).init()}]);