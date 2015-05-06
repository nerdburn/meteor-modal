/*
  MODAL
  - Dynamically insert a Meteor template into a modal window.
*/
Modal = {
  defaults: {
    classNames: []
  },
  show: function(modalTemplate) {
    Session.set('modalName', modalTemplate);
    console.log('modal options on show: ', Session.get('modalOptions') || this.defaults);
    Meteor.setTimeout(function(){
      Session.set('modalClass', 'on');
    }, 100);
  }, 
  hide: function() {
    var self = this;
    Session.set('modalClass', null);
    Meteor.setTimeout(function(){
      Session.set('modalName', null);
      self.clearOptions();
    }, 100);
  },
  options: function(options) {
    var defaults = JSON.parse(JSON.stringify(this.defaults)); // make copy without reference
    Session.set('modalOptions', _.extend(defaults, options));
    return Session.get('modalOptions');
  },
  clearOptions: function() {
    var self = this;
    Session.set('modalOptions', self.defaults);
  },
  series: {
    currSeries: false,
    currStep: 0,
    register: function(seriesName, seriesTemplates) {
      Session.set(seriesName, seriesTemplates);
    },
    show: function(seriesName) {
      var series = Session.get(seriesName);
      this.currSeries = series;
      if(series) {
        if(series[0].options)
          Modal.options(series[0].options);
        Modal.show(series[0].template);
      }
    },
    next: function() {
      var self = this;
      var series = self.currSeries;
      Modal.hide();
      if(series.length > self.currStep) {
        var newStep = self.currStep+1; 
        Meteor.setTimeout(function(){
          if(series[newStep].options)
            Modal.options(series[newStep].options);
          Modal.show(series[newStep].template);
          self.currStep = newStep;
        }, 100);
      } else {
        Modal.series.complete();
      }
    }, 
    prev: function() {
      var self = this;
      var series = self.currSeries;
      Modal.hide();
      if(self.currStep > 0 && self.currStep <= series.length) {
        var newStep = self.currStep-1;
        Meteor.setTimeout(function(){
          if(series[newStep].options)
            Modal.options(series[newStep].options);
          Modal.show(series[newStep].template);
          self.currStep = newStep;
        }, 100);
      } else {
        Modal.series.complete();
      }
    },
    complete: function() {
      this.currSeries = false;
      this.currStep = 0;
      Modal.hide();
    }
  }
};

Template.modal.helpers({
  modalName: function() {
    return Session.get('modalName');
  },
  modalClass: function() {
    return Session.get('modalClass');
  },
  modalClassNames: function() {
    var str = '';
    var opts = Session.get('modalOptions') || Modal.defaults;
    _.each(opts.classNames, function(item){
      str += ' ' + item;
    });
    return str;
  }
});

Template.modal.events({
  'click .modal-close, click .modal-overlay': function(e) {
    Modal.hide();
  },
  'click [data-modal-next]': function(e) {
    e.preventDefault();
    Modal.series.next();
  },
  'click [data-modal-prev]': function(e) {
    e.preventDefault();
    Modal.series.prev();
  },
  'click [data-modal-complete]': function(e) {
    e.preventDefault();
    Modal.series.complete();
  }  
});