App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function(){
    return App.initWeb3();
  },

  initWeb3: function(){
    if(typeof web3 == 'undefined'){
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Medicine.json", function(medicine) {
      App.contracts.Medicine = TruffleContract(medicine);
      App.contracts.Medicine.setProvider(App.web3Provider);
    });
  },

  searchMed: function(){
    var instance;
    var search = $('#searchbar').val();
    App.contracts.Medicine.deployed().then(function(_instance){
      instance =_instance;
      return instance.searchexpdate(search);
    }).then(function(medexpdate){
      $("#name").html($('#searchbar').val());
      $("#expdate").html(medexpdate);
    }).catch(function(err){
      console.error(err);
    });
    return App.searchdate();
  },

  searchdate: function(){
    var search = $('#searchbar').val();
    App.contracts.Medicine.deployed().then(function(instance){
      return instance.searchdate(search);
    }).then(function(meddate){
      $("#date").html(meddate);
    }).catch(function(err){
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
