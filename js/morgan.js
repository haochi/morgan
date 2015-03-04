(function (global, undefined) {
    var specs = {
        tasks: {
            fields: [
                { 
                    name: 'title',
                    label: 'Title',
                    type: 'string',
                    default: '',
                    required: true
                },
                { 
                    name: 'description',
                    label: 'Description',
                    type: 'text',
                    default: '',
                    required: true
                },
                { 
                    name: 'date',
                    label: 'Due Date',
                    type: 'date',
                    default: new Date,
                    required: true
                },
                {
                    name: 'priority',
                    label: 'Priority',
                    type: 'list',
                    default: 0,
                    options: [
                        { id: 0, display: 'When Free', order: 0 },
                        { id: 1, display: 'ASAP', order: 1 },
                        { id: 2, display: 'DEFCON 5', order: 2 }
                    ],
                    required: true
                },
                {
                    name: 'status',
                    label: 'Status',
                    type: 'list',
                    default: 1,
                    required: true,
                    options: [
                        { id: 0, display: 'Fuck It', order: 1 },
                        { id: 1, display: 'To Do', order: 2 },
                        { id: 2, display: 'In Queue', order: 3},
                        { id: 3, display: 'In Progress', order: 4},
                        { id: 4, display: 'Done', order: 5}
                    ]
                },
                {
                    name: 'parent',
                    label: 'Parent',
                    type: 'string',
                    default: ''
                },
                {
                    name: 'created_at',
                    default: function () {
                        return new Date;
                    }
                },
                {
                    name: 'updated_at',
                    default: function () {
                        return new Date;
                    }
                },
            ]
        }
    };

    function Morgan(dropboxClient) {
        this.internal = {};
        this.tables = {};
        this.specs = specs;

        this.client = dropboxClient;
        this.internal.dataStore = null;
    };

    Morgan.prototype.login = function (callback) {
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

    Morgan.prototype.prepare = function (callback) {
        var me = this,
            datastoreManager = me.client.getDatastoreManager();

        datastoreManager.openDefaultDatastore(function (error, datastore) {
            if (error) {
                console.log(error);
            }

            me.internal.dataStore = datastore;

            Object.keys(specs).forEach(function (tableName) {
                Object.defineProperty(me.tables, tableName, { 
                    get: function () { 
                        return datastore.getTable(tableName);
                    }
                });
            });

            callback.call(this, error);
        });
    };

    Morgan.prototype.create = function (table, values) {
        var me = this,
            tableRef = specs[table],
            cleanedValues = _.chain(defaultValues(tableRef))
                                .extend(values)
                                .pick(fieldNames(tableRef))
                                .value();

            me.tables[table].insert(cleanedValues);
    };

    Morgan.prototype.update = function (record, values) {
        var me = this,
            table = record.getTable().getId(),
            tableRef = specs[table],
            cleanedValues = _.chain(defaultValues(tableRef))
                                .extend(record.getFields())
                                .extend(values)
                                .pick(fieldNames(tableRef))
                                .value();

        record.update(cleanedValues);
    }

    Morgan.get = function (url, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                callback(request);
            }
        }
        request.open('GET', url, true);
        request.send(null);
        
    };

    global.Morgan = Morgan;

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
