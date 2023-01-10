# DataSave
A simple library for handling indexedDB *(Not support for index and cursor)*

## Create a Storage
```
var storage = new DataSave();
var version = 1;

storage.newStorage("storageName",version,[{   //onupgradeneeded
  key:"id",          //Name of KeyPath
  name:"texts",      //Name of ObjectStore
  delete:false,      //If it is true the ObjectStore is deleted
  increment:false,   //If it is true the ObjectStore is incremented
}],[{                                         //onsuccess
  name:"texts",      //Name of ObjectStore
  methods:[{                //Function to ObjectStore
    type:"add",             //Type of the function ["add","put","get","getAll","count","delete","clear"]
    name:"text",           //Name of this item
    value:"Helo world...",  //Value of this item
  }],
}]);
```

## Open a Storage
```
storage.openStorage("storageName",[{          //onsuccess
  name:"texts",      //Name of ObjectStore
  key:"id",          //Name of KeyPath
  methods:[{                //Function to ObjectStore
    type:"add",             //Type of the function ["add","put","get","getAll","count","delete","clear"] 
    name:"text",            //Name of this item
    value:"Helo world...",  //Value of this item
  }],
}]);
```

## Delete a Storage
```
storage.deleteStorage("storageName");
```
