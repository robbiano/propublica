var URL_GET = 'https://api.propublica.org/congress/v1/113/senate/members.json'

//Realiza el pedido del JSON al servidor de propublica
fetch(URL_GET, {
    method: 'GET',
    headers: {
        'X-API-KEY': 'bstQMPJjcTZEeWFdAZe07vRAfmPEZUWNB9B9Dwb1'
    }
}).then(function (response) {
    if (response.ok) {
        return response.json();
    } else {
        throw new error(rsponse.status)
    }

}).then(function (data) {
    app.miembros = data.results[0].members;
    /*llamado a funciones en archivo js statistics */
    start(app.miembros)
})
    .catch(function (error) {
        console.log('Looks like there was a problem: \n', error);
    });

let app = new Vue({
    el: "#app",
    data: {
        miembros: [],
        statistics: {
            democratas: [],
            republicanos: [],
            independientes: [],
            totalN: 0,
            democratas_vwp: 0,
            republicanos_vwp: 0,
            independientes_vwp: 0,
            totalV: 0,
            leastWithPartyVotes: [],
            mostWithPartyVotes: [],
        }
    },
    methods: {

        //obtengo miembros por partido 
        membersPerParty(miembros) {
            this.statistics.democratas = miembros.filter(this.filtroDemocratas);
            this.statistics.republicanos = miembros.filter(this.filtroRepublicanos);
            this.statistics.independientes = miembros.filter(this.filtroIndependientes);
            this.statistics.totalN = this.statistics.democratas.length + this.statistics.republicanos.length + this.statistics.independientes.length;
        },
        filtroDemocratas(miembros) {
            return miembros.party == "D";
        },
        filtroRepublicanos(miembros) {
            return miembros.party == "R";
        },
        filtroIndependientes(miembros) {
            return miembros.party == "ID";
        },

        //obtengo un promedio de cuanto votan por su partido 
        obtenerPromedio() {
            this.statistics.democratas_vwp = this.promedio(this.statistics.democratas);
            this.statistics.republicanos_vwp = this.promedio(this.statistics.republicanos);
            this.statistics.independientes_vwp = this.promedio(this.statistics.independientes);
            this.statistics.totalV = this.statistics.democratas_vwp + this.statistics.republicanos_vwp + this.statistics.independientes_vwp;
        },
        promedio(valor) {
            var total = 0;

            for (i = 0; i < valor.length; i++) {
                total += valor[i].votes_with_party_pct;
            }
            if (valor.length === 0) {
                return 0;
            }
            return Math.round(total / valor.length);
        },

        //identifico al 10% que mas y menos vota con su partido 
        obtenerPorcentaje(miembros) {
            this.statistics.leastWithPartyVotes = this.votos(miembros, "votes_with_party_pct", false);
            this.statistics.mostWithPartyVotes = this.votos(miembros, "votes_with_party_pct", true);
        },
        votos(array, propiedad, reverse) {

            array.sort(function (a, b) {
                return a[propiedad] - b[propiedad]
            });

            if (reverse) {
                array.reverse()
            };

            var diezmo = array.length * 10 / 100;
            var redondeo = Math.round(diezmo);

            var dieses = array.slice(0, redondeo);

            return dieses;
        },

    }
})

//llamo a todas las funciones 
function start(miembros) {
    //obtengo miembros por partido 
    app.membersPerParty(miembros);
    //obtengo un promedio de cuanto votan por su partido  
    app.obtenerPromedio();
    //identifico al 10% que mas y menos vota con su partido
    app.obtenerPorcentaje(miembros)
}













