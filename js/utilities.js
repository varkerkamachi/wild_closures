(function(){
  var Utils = function(){
    return new Utilities();
  }
  
  function Utilities(){
    this.defaults = {
      modalCount: 0,
      crime: '',
      reportCount: 0,
      mapEl: '',
      instructionEl: '',
      loc: '',
      zval: 2
    };
    
    this.buildSelectMenu = function( data, options ){
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
    this.closePopper = function(e, id){
      var elmToRemove = e.target.parentNode.parentNode;
      var modals = document.querySelectorAll('.crime_modal');
      elmToRemove.parentNode.removeChild(elmToRemove);
      
      if(modals.length < 1){
        this.defaults.crime.value = "---";
        this.defaults.loc.style.display = "none";
        this.defaults.instructionEl[0].style.display = "none";
      }
    };
        
    this.buildPopup = function(e, msg) {
      var modal = document.createElement('div');
      modal.setAttribute('class', 'crime_modal');
      modal.style['z-index'] = this.defaults.zval;
      modal.setAttribute('id', 'crime_modal' + this.defaults.modalCount + '');
      var zidx = window.getComputedStyle(modal);
      
      modal.addEventListener('click', function(e){ e.stopPropagation();});
      
      var closeThis = this.closePopper;//need for scope on anon function to close
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
      closer.addEventListener('click', function(e){ return closeThis(e, modal.id);});
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
      
    };

  }
  
  if(!window.Utils){
    window.Utils = Utils;
  }
})();