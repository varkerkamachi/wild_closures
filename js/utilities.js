(function(){
  var Utils = function(){
    return new Utilities();
  }
  
  function Utilities(){
    Utilities.prototype.defaults = {
      modalCount: 0,
      crime: '',
      reportCount: 0,
      maxClicks: 10,
      zval: 2
    };
    
    //sets count of a variable by adding or subtracting 1, or resets to 0
    _resetCount = function(metric, val){
      if(val == 0)        { Utilities.prototype.defaults[''+metric+''] = 0;}
      else if(val == -1)  { Utilities.prototype.defaults[''+metric+''] --; }
      else                { Utilities.prototype.defaults[''+metric+''] ++; }

      if(metric == "modalCount"){
        return Utilities.prototype.handleModalDependents(Utilities.prototype.defaults[''+metric+'']);
      }
      else{
        return false;
      }
    };
    _handleReportCount = function(count) {
      if(count >= Utilities.prototype.defaults.maxClicks){
        alert("Maximum number of reports created.\nClose map modals to continue.");
        return false;
      }
    };
    Utilities.prototype.handleReportCount = function(count){
      _handleReportCount(count);
    };
    Utilities.prototype.getReportCount = function() {
      return Utilities.prototype.defaults.reportCount;
    };
    Utilities.prototype.resetCount = function(metric, val) {
      return _resetCount(metric, val);
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
      _resetCount('reportCount', -1);
    };

    //appends an element into the DOM
    //options includes: classKeys, idKey, styleKeys, dataSubject, innerHTML
    Utilities.prototype.insertDOMNode = function(parent, node, options) {
      if(document.getElementById(options.idKey) == null){//don't want to append more than one instruction element
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
      }
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