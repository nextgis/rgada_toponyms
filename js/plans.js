Vue.component('plans', {
    template: '#plansPanelTemplate',
    data: function(){
        return {
            items: [],
            searchQuery: "",
            activeItem: undefined,
            itemsDateRange: {
                min: undefined,
                max: undefined
            }
        }
    },
    computed: {
        sortedItems: function(){
            var filteredItems = this.items,
                searchQuery = this.searchQuery.toLowerCase();

            if (this.searchQuery){
                filteredItems = filteredItems.filter(function(item){

                    var totalString = item.feature.properties.ogc_fid + " " + item.feature.properties.pages.toLowerCase() + " " + item.feature.properties.toponym.toLowerCase();                    
                    return (totalString.indexOf(searchQuery)>-1);

                }, this);
            }

            filteredItems = filteredItems.sort(function(a,b){
                return (a.feature.properties.ogc_fid - b.feature.properties.ogc_fid);
            });

            return filteredItems;
        }
    },
    methods: {
        init: function(){
            var tempItems = [];
            layers.forEach(function(layer){
                for (var key in layer.geojson._layers){
                    layer.geojson._layers[key].sourceLayer = layer;
                    tempItems.push(layer.geojson._layers[key]);
                }
            })
            this.items = tempItems;

            $(".object-list").removeClass("loading");
        },
        activateItem: function(item, options){            
            if (this.activeItem)
                unhighlightFeature(this.activeItem);

            this.activeItem = item;
            if (options.withZooming) mainMap.setView(item.getCenter());
            if (options.withScrolling) this.$refs.plansList.scrollToItem(item)
            highlightFeature(item);
        }
    }
});

Vue.component('plans-list', {
    template: '#plansListTemplate',
    props: [
        "items",
        "activeItem"
    ],
    watch: {
        items: function(value){
            this.$el.scrollTop = 0;
            if (this.activeItem) this.scrollToItem(this.activeItem);
        }
    },
    methods:{
        scrollToItem(item){
            var that = this;
            Vue.nextTick(function () {
                var itemEl = $(".plan-item--active")[0];

                if (itemEl)
                   that.$el.scrollTop = itemEl.offsetTop - (that.$el.clientHeight - itemEl.offsetHeight)/2;

            })
        }
    }
});

Vue.component('search', {
    template: '#searchTemplate',
    data: function(){
        return{
            searchQuery: ""
        }
    }
});

var vueApp = new Vue({ 
  el: '#vue-app'
});

