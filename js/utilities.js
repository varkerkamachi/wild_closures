(function(){
  var Utils = function(){
    return new Utilities();
  }
  
  function Utilities(){
    Utilities.prototype.defaults = {
      modalCount: 0,
      crime: '',
      reportCount: 0,
      mapEl: '',
      instructionEl: '',
      loc: '',
      zval: 2
    };
    
    //sets count of a variable by adding or subtracting 1, or resets to 0
    _resetCount = function( metric, val){
      if(val == 0)        { Utilities.prototype.defaults[''+metric+''] = 0;}
      else if(val == -1)  { Utilities.prototype.defaults[''+metric+''] --; }
      else                { Utilities.prototype.defaults[''+metric+''] ++; }
      console.log("metric: " + Utilities.prototype.defaults[''+metric+'']);

      if(metric == "modalCount"){
        return Utilities.prototype.handleModalDependents(Utilities.prototype.defaults[''+metric+'']);
      }
      else{
        return false;
      }
    };
    
    Utilities.prototype.handleModalDependents = function(val) {
      if(val < 1){
        var crimeSelect = this.findDOMNode('crime_selector'),
        event = new Event('change');
        crimeSelect.value = "---";
        crimeSelect.dispatchEvent(event);
      }
      
    };
    Utilities.prototype.buildSelectMenu = function( data, options ){
      this.nameKey = '',
      this.idKey = '',
      this.elementClassKey = '',
      this.defaultVals = {
      'value': '',
      'text': '',
      };
      if(typeof options != "undefined"){
        this.nameKey = options.nameKey;
        this.idKey = options.idKey;
        this.elementClassKey = options.elementClassKey;
        this.defaultVals = options.defaultVals;
      }
      
      this.menu = '<select name="' + this.nameKey + '" id="' + this.idKey + '">';
      this.menu += '<option value="' + this.defaultVals['value'] + '">' + this.defaultVals['text'] + '</option>';
      for(var i=0, max = data.length; i<max; i++){
        this.menu += '<option class="' + this.elementClassKey + '" value="' + data[i] + '">' + data[i] + '</option>';
      }
      this.menu += '</select>';
      return this.menu;
    };
    
    //close  modals
    Utilities.prototype.closePopper = function(e, id){
      var elmToRemove = e.target.parentNode.parentNode;
      var modals = document.querySelectorAll('.crime_modal');
      elmToRemove.parentNode.removeChild(elmToRemove);
      _resetCount('modalCount', -1);
      //console.log("mcount: " + this.defaults.modalCount);
    };
        
    Utilities.prototype.buildPopup = function(e, msg) {
      var modal = document.createElement('div');
      modal.setAttribute('class', 'crime_modal');
      modal.style['z-index'] = this.defaults.zval;
      modal.setAttribute('id', 'crime_modal' + this.defaults.modalCount + '');
      var zidx = window.getComputedStyle(modal);
      
      modal.addEventListener('click', function(e){ e.stopPropagation();});
      
      var tip = document.createElement('div');
      tip.setAttribute('class', 'pointer');
      
      var left_col = document.createElement('div');
      left_col.setAttribute('class', 'col');
      
      var modal_img = document.createElement('div');
      modal_img.setAttribute('class', 'crime_icon ' + this.defaults.crime.toLowerCase().replace(/\s/g, '-') + '');
      
      var right_col = document.createElement('div');
      right_col.setAttribute('class', 'col');
      
      var closer = document.createElement('div');
      closer.setAttribute('class', 'close_button');
      closer.addEventListener('click', function(e){ return Utilities.prototype.closePopper(e, modal.id);});
      // console.log("mid: " + modal.id);
      
      var closer_text = document.createElement('span');
      closer_text.innerHTML='close';
      
      var text = document.createElement('p');
      text.innerHTML=msg;
      
      closer.appendChild(closer_text);
      left_col.appendChild(modal_img);
      right_col.appendChild(text);
      modal.appendChild(left_col);
      modal.appendChild(right_col);
      modal.appendChild(closer);
      modal.appendChild(tip);

      this.defaults.reportCount++;
      this.defaults.zval++;
      
      var xpos = e.pageX - this.defaults.mapEl.offsetLeft;
      var ypos = e.pageY - this.defaults.mapEl.offsetTop;
      modal.style.left = (xpos-xpos - 110) + 'px';
      modal.style.top = (ypos-ypos - 135) + 'px';
      e.target.appendChild(modal);
      _resetCount('modalCount', 1);
    };
    
    //appends an element into the DOM
    //options includes: classKeys, idKey, styleKeys, dataSubject, innerHTML
    Utilities.prototype.insertDOMNode = function(parent, node, options) {
      var domNode = document.createElement(node);
      if(typeof options != "undefined"){
        this.elementStyleKeys = options.styleKeys;
        this.idKey = options.idKey;
        this.elementClassKeys = options.classKeys;
        this.elementDataSubject = options.dataSubject;
        this.elementValue = options.innerText;
      }
      domNode.setAttribute('id', this.idKey);
      domNode.setAttribute('class', this.elementClassKeys);
      domNode.setAttribute('style', this.elementStyleKeys);
      domNode.setAttribute('data-subject', this.elementDataSubject);
      domNode.innerHTML = this.elementValue;
      parent.appendChild(domNode);
    };
    
    Utilities.prototype.findDOMNode = function(nodeId) {
      return document.getElementById(nodeId);
    };

    //removes an element from the DOM
    Utilities.prototype.removeDOMNode = function(parent, elmId) {
      if(typeof elmId == "undefined"){
        return false;
      }
      parent.removeChild(document.getElementById(elmId));
    };
  }
  
  if(!window.Utils){
    window.Utils = Utils;
  }
})();