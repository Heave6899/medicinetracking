pragma solidity ^0.5.0;

contract Medicine {
  struct Medicines {
        uint id;
        string mfg;
        string name;
        string expdate;
        string date;
        string shipped;
  }
  struct Shipcompany{
        uint id;
        string name;
        string contact;
        string tempcontrol;
        string typicaldays;
  }
  struct Shipment{
        uint id;
        string companyname;
        string medicinename;
        string temp;
        string senddate;
        string expecteddeliverydate;
  }
  mapping(uint => Medicines) public medicines;
  mapping(uint => Shipment) public shipments;
  mapping(uint => Shipcompany) public shipcomps;

  uint public count;
  uint public countcomp;
  uint public countship;
  bool flag; bool flag1; bool flag2; bool flag3=false;

  function addMedicine(string memory _mfg,string memory _name, string memory _expdate,string memory _date) public {
        count ++;
        for(uint i = 0;i<=count;i++){
            flag = false;
            for(uint j = 0;j<=count;j++){
                if((keccak256(abi.encodePacked((_name))) == keccak256(abi.encodePacked((medicines[j].name))))){
                medicines[count] = Medicines(count,_mfg, _name, medicines[j].expdate, medicines[j].date,'No');
                flag = true;
                    break;
                }
            }
          }
          if(flag==false)
          medicines[count] = Medicines(count,_mfg, _name, _expdate, _date,'No');
      }
  function addShipment(string memory _companyname, string memory _medicinename,string memory _temp,string memory _senddate,string memory _expecteddeliverydate) public {
    for(uint i = 0;i<=count;i++){
      if((keccak256(abi.encodePacked((_medicinename))) == keccak256(abi.encodePacked((medicines[i].name))))){
        medicines[i].shipped = 'Yes';
        flag1 = true;
      }
    }
    for(uint j = 0;j<=countcomp;j++){
      if((keccak256(abi.encodePacked((_companyname))) == keccak256(abi.encodePacked((shipcomps[j].name))))){
        flag2 = true;
      }
    }
    if(flag1 == true && flag2 == true){
      countship++;
      shipments[countship] = Shipment(countship,_companyname,_medicinename,_temp,_senddate,_expecteddeliverydate);
    }
  }
  function addShipcomp(string memory _name,string memory _contact, string memory _tempcontrol, string memory _typicaldays) public{
    flag3 = false;
    if(countcomp == 0)
    {
      countcomp++;
      shipcomps[countcomp] = Shipcompany(countcomp,_name,_contact,_tempcontrol,_typicaldays);
    }
    else{
      for(uint i = 0;i<=countcomp;i++)
      {
        if(keccak256(abi.encodePacked(_name)) == keccak256(abi.encodePacked(shipcomps[i].name))){
          flag3 = true;
        }
      }
      if(flag3 == false)
        {
          countcomp++;
          shipcomps[countcomp] = Shipcompany(countcomp,_name,_contact,_tempcontrol,_typicaldays);
        }
    }
  }
  constructor() public{
        addMedicine("Manufacturer1-M","Medicine1-1","2019-02-28","2017-03-20");
        addMedicine("Manufacturer2-M","Medicine2-2","2020-05-04","2016-02-20");
        addMedicine("Manufacturer3-M","Medicine1-1","2019-02-25","2017-03-19");
        addMedicine("Manufacturer4-C","Medicine1-1","2019-02-25","2017-03-19");
        addShipcomp("Company1","+918140556655","Yes","5");
        addShipcomp("Company2","+918140556666","Yes","6");
        addShipcomp("Company3","+918142576550","No","5");
        addShipment("Company3","Medicine2-2","No","2019-09-16","2019-09-21");
        addShipment("Company1","Medicine1-1","No","2019-09-16","2019-09-21");

    }
}