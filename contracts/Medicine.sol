pragma solidity ^0.5.0;


contract Medicine {
  //string h; string date; uint count = 0;
  struct Medicines {
        uint id;
        string mfg;
        string name;
        string expdate;
        string date;
  }
  mapping(uint => Medicines) public medicines;
  uint public count;
  bool flag;
  function addMedicine(string memory _mfg,string memory _name, string memory _expdate,string memory _date) public {
        count ++;
        for(uint i = 0;i<=count;i++){
            flag = false;
            for(uint j = 0;j<=count;j++){
                if((keccak256(abi.encodePacked((_name))) == keccak256(abi.encodePacked((medicines[j].name))))){
                medicines[count] = Medicines(count,_mfg, _name, medicines[j].expdate, medicines[j].date);
                flag = true;
                    break;
                }
            }
          }
          if(flag==false)
          medicines[count] = Medicines(count,_mfg, _name, _expdate, _date);
      }
  constructor () public {
        addMedicine("Manufacturer 1-M","Medicine 1-1","2019-02-28","2017-03-20");
        addMedicine("Manufacturer 2-M","Medicine 2-2","2020-05-04","2016-02-20");
        addMedicine("Manufacturer 3-M","Medicine 1-1","2019-02-25","2017-03-19");
        addMedicine("Manufacturer 4-C","Medicine 1-1","2019-02-25","2017-03-19");


    }
  //function getname(uint i) public view returns(string memory){
  //  return medicines[i].name;
  //}
  //function getdate(uint i) public view returns(string memory){
  //  return medicines[i].date;
  //}
  //function getexpdate(uint i) public view returns(string memory){
  //  return medicines[i].expdate;
  //}
  //function search(string memory _name) public view returns(bool){
  //  for(uint i = 0; i <= count; i++)
  //  {
  //    if((keccak256(abi.encodePacked((medicines[i].name))) == keccak256(abi.encodePacked((_name))))){
  //          return true;
  //    }
  // }
  //}
}
