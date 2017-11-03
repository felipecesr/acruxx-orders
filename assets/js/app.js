'use strict'

var Order = function(user, product, date, price) {
    this.user = user;
    this.product = product;
    this.date = date;
    this.price = price;
};

var app = new Vue({
    el: '#app',

    data: function() {
        return {
            users: [],
            products: [],
            orders: [],
            filter: '',
            modalIndex: '',
            ordersFrom: 2
        };
    },

    computed: {
        filterOrders: function() {
            if (this.filter) {
                var exp = new RegExp(this.filter.trim(), 'i');
                return this.checkOrdersFrom.filter(function (order) {
                    return exp.test(order.user) || exp.test(order.product);
                });
            } else {
                return this.checkOrdersFrom;
            }
        },

        checkOrdersFrom: function() {
            switch (this.ordersFrom) {
                case '0':
                    return this.orders.filter(function(order) {
                        var now = moment();
                        var date = moment(order.date);

                        return (now.isSame(date, 'd'));
                    });
                    break;
                case '1':
                    return this.orders.filter(function(order) {
                        var now = moment();
                        var date = moment(order.date);

                        return (now.isoWeek() === date.isoWeek());
                    });
                    break;
                default:
                    return this.orders;
                    break;
            }
        }
    },

    methods: {
        addOrder: function() {
            var order = new Order(
                $(this.$refs.userAdd).val(),
                $(this.$refs.productAdd).val(),
                new Date(),
                $(this.$refs.priceAdd).val()
            );
            this.orders.push(order);

            this.clearAddValues();
        },

        editOrder: function() {
            var keys = Object.keys(this.orders[this.modalIndex]);

            keys.forEach(function(key) {
                this.orders[this.modalIndex][key] = $(this.$refs[key + 'Modal']).val();
            }.bind(this));

            this.modalIndex = '';
        },

        removeOrder: function(index) {
            this.orders.splice(index, 1);
        },

        openModalEdit: function(index) {
            this.modalIndex = index;
            $('.ui.modal').modal('show');
        },

        clearAddValues() {
            $(this.$refs.userAdd).dropdown('restore defaults');
            $(this.$refs.productAdd).dropdown('restore defaults');
            $(this.$refs.priceAdd).val('');
        },

        getModalKeyValue(key) {
            var index = this.modalIndex;

            if (index !== '') {
                return (key === 'date') ? moment(this.orders[index].date).format('L') : this.orders[index][key];
            } else {
                return '';
            }
        }
    },

    created: function() {
        $.ajax({
            url: '/api.json',
            success: function(result) {
                this.users = result.users;
                this.products = result.products;
                this.orders = result.orders;
            }.bind(this)
        });
    },

    mounted: function() {
        $('.ui.radio.checkbox').checkbox();

        $('select.dropdown').dropdown();
    },

    filters: {
        date: function(date) {
            return moment(date).format('L');
        }
    }
});
