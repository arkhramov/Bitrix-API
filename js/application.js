function application() {
}

application.prototype.displayDealStatus = function (selector) {
    BX24.callMethod(
        "crm.status.list",
        {
            order: { "SORT": "ASC" },
            filter: { "ENTITY_ID": "STATUS" }
        },
        function(result)
        {
            if(result.error())
                console.error(result.error());
            else
            {
                console.dir(result.data());
                if(result.more())
                    result.next();
            }
            console.log(result.data().length)
            console.log(result.data()[1])
            console.log(result.data()[1].NAME)
            $('#dealNew').html(result.data()[0].NAME);
            $('#dealInProcess').html(result.data()[1].NAME);
            $('#dealProcessed').html(result.data()[2].NAME);
            $('#dealConverted').html(result.data()[3].NAME);
            $('#dealJunk').html(result.data()[4].NAME);

        }
    );
}

application.prototype.displayUserDeals = function (idUser) {

    let dealSum = 0;
    let dealHtml = '';

    const curapp = this;

    BX24.callMethod(
        'crm.deal.list',
        {
            order: { "STAGE_ID": "ASC" },
            filter: { "ASSIGNED_BY_ID": idUser},
            select: [ "ID", "TITLE", "OPPORTUNITY" ]
        },
        function (result) {
            if (result.error()) {
                curapp.displayErrorMessage('Ошибка загрузки сделок!')
                console.error(result.error());
            } else {
                const data = result.data();
                console.log(data);

                for (indexDeal in data) {
                    dealSum += parseFloat(data[indexDeal].OPPORTUNITY);
                    dealHtml += '<td><th scope="row">' + data[indexDeal].ID + '</th><td>' + data[indexDeal].TITLE + '</td></td>' + data[indexDeal].OPPORTUNITY + '</td></tr>';
                }

                if (result.more())
                    result.next();
                else {
                    $('#deal-list').html(dealHtml);
                    $('#deal-sum').html('<span class="volume">' + dealSum + '</span><br />общая сумма')
                }

                console.log(data[0])
            }
        }
    );
}

app = new application();