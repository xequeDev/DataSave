var DataSave = function(){
    var mainObject = this;
    this.totalStorage = undefined;
    this.usedStorage = undefined;
    navigator.storage.estimate().then(function(result){mainObject.totalStorage = result.quota});
    navigator.storage.estimate().then(function(result){mainObject.usedStorage = result.usage});
    this.newStorage = function(name,version,setup,handle){
        return new Promise(function(resolve,reject){
            var request = indexedDB.open(name,version);
            request.onupgradeneeded = function(){
                var storage = request.result;
                for(var index in setup){
                    if(setup[index].delete == undefined || setup[index].delete == false){
                        storage.createObjectStore(setup[index].name,{
                            keyPath:setup[index].key == undefined ? "id" : setup[index].key,
                            autoIncrement:setup[index].increment == undefined || setup[index].increment == false ? false : true,
                        });
                    }else if(setup[index].delete == true){
                        storage.deleteObjectStore(setup[index].name);
                    }
                }
            }
            request.onsuccess = function(){
                var returnedValues = [];
                var storage = request.result;
                for(var index01 = 0;index01 < handle.length;index01++){
                    for(var index02 = 0;index02 < handle[index01].methods.length;index02++){
                        if(handle[index01].methods[index02].type == "add" || handle[index01].methods[index02].type == "new"){
                            if(handle[index01].methods[index02].name == undefined){
                                storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name).add({value:handle[index01].methods[index02].value});
                                if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                    resolve(returnedValues == [] ? undefined : returnedValues);
                                }
                            }else{
                                storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name).add({
                                    [handle[index01].key == undefined ? "id" : handle[index01].key]:handle[index01].methods[index02].name,
                                    value:handle[index01].methods[index02].value,
                                });
                                if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                    resolve(returnedValues == [] ? undefined : returnedValues);
                                }
                            }
                        }else if(handle[index01].methods[index02].type == "put" || handle[index01].methods[index02].type == "update" || handle[index01].methods[index02].type == "edit"
                        || handle[index01].methods[index02].type == "write"){
                            if(handle[index01].methods[index02].name == undefined){
                                storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name).put({value:handle[index01].methods[index02].value});
                                if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                    resolve(returnedValues == [] ? undefined : returnedValues);
                                }
                            }else{
                                storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name).put({
                                    [handle[index01].key == undefined ? "id" : handle[index01].key]:handle[index01].methods[index02].name,
                                    value:handle[index01].methods[index02].value,
                                });
                                if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                    resolve(returnedValues == [] ? undefined : returnedValues);
                                }
                            }
                        }else if(handle[index01].methods[index02].type == "get" || handle[index01].methods[index02].type == "read"){
                            storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name)
                                .get(handle[index01].methods[index02].name).onsuccess = function(){
                                    if(this.result == undefined){
                                        returnedValues.push({type:"get",value:undefined});
                                        if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                            resolve(returnedValues == [] ? undefined : returnedValues);
                                        }
                                    }else{
                                        returnedValues.push({type:"get",value:this.result.value});
                                        if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                            resolve(returnedValues == [] ? undefined : returnedValues);
                                        }
                                    }
                            }
                        }else if(handle[index01].methods[index02].type == "exist"){
                            if(handle[index01].methods[index02].name == undefined){
                                returnedValues.push({type:"existObject",value:storage.objectStoreNames.contains(handle[index01].name)});
                                if(index01 == handle.length-1 && index02 == handle[index01].methods.length-1){
                                    resolve(returnedValues == [] ? undefined : returnedValues);
                                }
                            }else{
                                storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name)
                                .get(handle[index01].methods[index02].name).onsuccess = function(){
                                    if(this.result == undefined){
                                        returnedValues.push({type:"existValue",value:false});
                                        if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                            resolve(returnedValues == [] ? undefined : returnedValues);
                                        }
                                    }else{
                                        returnedValues.push({type:"existValue",value:true});
                                        if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                            resolve(returnedValues == [] ? undefined : returnedValues);
                                        }
                                    }
                                };
                            }
                        }else if(handle[index01].methods[index02].type == "getAll" || handle[index01].methods[index02].type == "readAll"){
                            storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name)
                                .getAll().onsuccess = function(){
                                    returnedValues.push({type:"getAll",value:this.result});
                                    if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                        resolve(returnedValues == [] ? undefined : returnedValues);
                                    }
                            };
                        }else if(handle[index01].methods[index02].type == "delete" || handle[index01].methods[index02].type == "remove"){
                            storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name).delete(handle[index01].methods[index02].name);
                            resolve(returnedValues == [] ? undefined : returnedValues);
                        }else if(handle[index01].methods[index02].type == "clear"){
                            storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name).clear();
                            resolve(returnedValues == [] ? undefined : returnedValues);
                        }else if(handle[index01].methods[index02].type == "count"){
                            storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name)
                                .count().onsuccess = function(){
                                    returnedValues.push({type:"count",value:this.result});
                                    if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                        resolve(returnedValues == [] ? undefined : returnedValues);
                                    }
                            };
                        }
                    }
                }
            }
        });
    }
    this.openStorage = function(name,handle){
        return new Promise(function(resolve,reject){
            var request = indexedDB.open(name);
            request.onsuccess = function(){
                var returnedValues = [];
                var storage = request.result;
                for(var index01 = 0;index01 < handle.length;index01++){
                    for(var index02 = 0;index02 < handle[index01].methods.length;index02++){
                        if(handle[index01].methods[index02].type == "add" || handle[index01].methods[index02].type == "new"){
                            if(handle[index01].methods[index02].name == undefined){
                                storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name).add({value:handle[index01].methods[index02].value});
                                if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                    resolve(returnedValues == [] ? undefined : returnedValues);
                                }
                            }else{
                                storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name).add({
                                    [handle[index01].key == undefined ? "id" : handle[index01].key]:handle[index01].methods[index02].name,
                                    value:handle[index01].methods[index02].value,
                                });
                                if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                    resolve(returnedValues == [] ? undefined : returnedValues);
                                }
                            }
                        }else if(handle[index01].methods[index02].type == "put" || handle[index01].methods[index02].type == "update" || handle[index01].methods[index02].type == "edit"
                        || handle[index01].methods[index02].type == "write"){
                            if(handle[index01].methods[index02].name == undefined){
                                storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name).put({value:handle[index01].methods[index02].value});
                                if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                    resolve(returnedValues == [] ? undefined : returnedValues);
                                }
                            }else{
                                storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name).put({
                                    [handle[index01].key == undefined ? "id" : handle[index01].key]:handle[index01].methods[index02].name,
                                    value:handle[index01].methods[index02].value,
                                });
                                if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                    resolve(returnedValues == [] ? undefined : returnedValues);
                                }
                            }
                        }else if(handle[index01].methods[index02].type == "get" || handle[index01].methods[index02].type == "read"){
                            storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name)
                                .get(handle[index01].methods[index02].name).onsuccess = function(){
                                    if(this.result == undefined){
                                        returnedValues.push({type:"get",value:undefined});
                                        if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                            resolve(returnedValues == [] ? undefined : returnedValues);
                                        }
                                    }else{
                                        returnedValues.push({type:"get",value:this.result.value});
                                        if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                            resolve(returnedValues == [] ? undefined : returnedValues);
                                        }
                                    }
                            }
                        }else if(handle[index01].methods[index02].type == "exist"){
                            if(handle[index01].methods[index02].name == undefined){
                                returnedValues.push({type:"existObject",value:storage.objectStoreNames.contains(handle[index01].name)});
                                if(index01 == handle.length-1 && index02 == handle[index01].methods.length-1){
                                    resolve(returnedValues == [] ? undefined : returnedValues);
                                }
                            }else{
                                storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name)
                                .get(handle[index01].methods[index02].name).onsuccess = function(){
                                    if(this.result == undefined){
                                        returnedValues.push({type:"existValue",value:false});
                                        if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                            resolve(returnedValues == [] ? undefined : returnedValues);
                                        }
                                    }else{
                                        returnedValues.push({type:"existValue",value:true});
                                        if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                            resolve(returnedValues == [] ? undefined : returnedValues);
                                        }
                                    }
                                };
                            }
                        }else if(handle[index01].methods[index02].type == "getAll" || handle[index01].methods[index02].type == "readAll"){
                            storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name)
                                .getAll().onsuccess = function(){
                                    returnedValues.push({type:"getAll",value:this.result});
                                    if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                        resolve(returnedValues == [] ? undefined : returnedValues);
                                    }
                            };
                        }else if(handle[index01].methods[index02].type == "delete" || handle[index01].methods[index02].type == "remove"){
                            storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name).delete(handle[index01].methods[index02].name);
                            resolve(returnedValues == [] ? undefined : returnedValues);
                        }else if(handle[index01].methods[index02].type == "clear"){
                            storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name).clear();
                            resolve(returnedValues == [] ? undefined : returnedValues);
                        }else if(handle[index01].methods[index02].type == "count"){
                            storage.transaction(handle[index01].name,"readwrite").objectStore(handle[index01].name)
                                .count().onsuccess = function(){
                                    returnedValues.push({type:"count",value:this.result});
                                    if(index01 == handle.length && index02 == handle[index01-1].methods.length){
                                        resolve(returnedValues == [] ? undefined : returnedValues);
                                    }
                            };
                        }
                    }
                }
            }
        });
    }
    this.existStorage = async function(name){
        return (await window.indexedDB.databases()).map(storage => storage.name).includes(name);
    }
    this.deleteStorage = function(name){
        indexedDB.deleteDatabase(name);
    }
}
