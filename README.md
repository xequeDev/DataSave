# DataSave
A simple library for handling indexedDB *(Not support for index and cursor)*

## Get the library
```
var storage = new DataSave();
```

## Create a new Storage
```
var version = 1;
var name = "StorageName";

storage.newStorage(name,version,
  [{}], //Like onupgradeneeded
  [{}], //Like onsuccess
);
```

### newStorage functions

#### onupgradeneeded
- **key**: The name of keypath.
- **delete**: if this is true the objectStore is deleted.
- **increment**: if this is true the objectStore is incrementable.

#### onsuccess
- **name**: The name of objectStore.
- **methods**: The methods of a objectStore.

#### methods
- **add** or **new**: Add a item to objectStore.
- **put** or **update** or **edit** or **write**: Edit a item.
- **get** or **read**: Get content of a item.
- **getAll**: Get content of all items.
- **delete** or **remove**: Delete a item.
- **clear**: Delete all items.
- **count**: Count the amount of items.
- **exist**: Verify If item exist.

## Open a Storage
```
storage.openStorage("storageName",
  [{}]
); //Like on success - Methods above
```
## Verify if a Storage exists
```
storage.existStorage("storageName");
```

## Delete a Storage
```
storage.deleteStorage("storageName");
```
