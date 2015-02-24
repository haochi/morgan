(function (global, undefined) {
    var tables = {
        tasks: {
            fields: [
                { name: 'title', default: '' },
                { name: 'description', default: '' },
                { name: 'priority', default: 0 },
                { name: 'status', default: 0 },
                { name: 'parent', default: '' },
                { name: 'created_at', default: function () { return new Date; } }
            ]
        }
    };

    function Alfred(dropboxClient) {
        this.internal = {};
        this.tables = {};

        this.client = dropboxClient;
        this.internal.dataStore = null;
    };

    Alfred.prototype.login = function (callback) {
        var me = this;

        me.client.authenticate({interactive: true}, function (error) {
            if (error) {
                console.log(error);
            }
        });

        if (me.client.isAuthenticated()) {
            callback.call(this);
        }
    };

    Alfred.prototype.prepare = function (callback) {
        var me = this,
            datastoreManager = me.client.getDatastoreManager();

        datastoreManager.openDefaultDatastore(function (error, datastore) {
            if (error) {
                console.log(error);
            }

            me.internal.dataStore = datastore;

            Object.keys(tables).forEach(function (tableName) {
                Object.defineProperty(me.tables, tableName, { 
                    get: function () { 
                        return datastore.getTable(tableName);
                    }
                });
            });

            callback.call(this, error);
        });
    };

    Alfred.prototype.create = function (table, values) {
        var me = this,
            tableRef = tables[table];
            var cleanedValues = _.chain(defaultValues(tableRef))
                                .extend(values)
                                .pick(fieldNames(tableRef))
                                .value();

            me.tables[table].insert(cleanedValues);
    };

    Alfred.get = function (url, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                callback(request);
            }
        }
        request.open('GET', url, true);
        request.send(null);
        
    };

    global.Alfred = Alfred;

    function fieldNames(table) {
        return table.fields.map(function (field) {
            return field.name;
        });
    }

    function defaultValues(table) {
        return table.fields.reduce(function (memo, me) {
            memo[me.name] = _.isFunction(me.default) ? me.default() : me.default;
            return memo;
        }, {});
    }
}(window));
