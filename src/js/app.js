App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Medicine.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Medicine = TruffleContract(medicine);
      // Connect provider to interact with contract
      App.contracts.Medicine.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Medicine.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.medicineAdded({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var medicineInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Medicine.deployed().then(function(instance) {
      medicineInstance = instance;
      return medicineInstance.count();
    }).then(function(count) {
      var mResults = $("#Results");
      mResults.empty();

      var mSelect = $('#Select');
      mSelect.empty();

      for (var i = 1; i <= count; i++) {
        medicineInstance.medicines(i).then(function(medicine) {
          var id = medicine[0];
          var name = medicine[1];
          var expdate = medicine[2];
          var date = medicine[3];

          // Render Result
          var medicineTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + expdate + "</td><td>" +date+"</td></tr>"
          mResults.append(medicineTemplate);
        });
      }
      return medicineInstance.medicines(App.account);
    }).catch(function(error) {
      console.warn(error);
    });
  },

  search: function() {
    var Id = $('#mSelect').val();
    App.contracts.Medicine.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};
$(function() {
  $(window).load(function() {
    App.init();
  });
});
