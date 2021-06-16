function application() {
}

application.prototype.displayDealStatus = function () {
    BX24.callMethod(
        "crm.status.list",
        {
            order: { "SORT": "ASC" },
            filter: { "ENTITY_ID": "DEAL_STAGE" }
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

            $('#dealNew').html(result.data()[0].NAME);
            $('#dealInProcess').html(result.data()[1].NAME);
            $('#dealProcessed').html(result.data()[2].NAME);
            $('#dealConverted').html(result.data()[3].NAME);
            $('#dealJunk').html(result.data()[4].NAME);
        }
    );
}

application.prototype.displayDealProducts = function () {

    let dealProducts = '';

    BX24.callMethod(
        "crm.productrow.list",
        {
            filter:
                {
                    "OWNER_TYPE": "D",
                    "OWNER_ID": "1"
                }
        },
        function(result)
        {
            if(result.error())
                console.error(result.error());
            else
            {
                const data = result.data();
                console.dir(result.data());
                if(result.more())
                    result.next();
                console.log(data[0]);

                for (indexDeal in data) {
                    dealProducts += '<div>' + data[indexDeal].PRODUCT_NAME + ' | ' + data[indexDeal].QUANTITY + data[indexDeal].MEASURE_NAME + ' | ' + data[indexDeal].PRICE + '</div>';
                }

                $('#productItem').html(dealProducts);
            }
        }
    );
}

application.prototype.displayUserDeals = function (status) {

    let dealHtml = '';

    const curapp = this;

    app.displayDealProducts();

    BX24.callMethod(
        'crm.deal.list',
        {
            order: { "STAGE_ID": "ASC" },
            filter: { "CLOSED": "N", "STAGE_ID": status},
            select: [ "ID", "TITLE", "STAGE_ID", "OPPORTUNITY", "CURRENCY_ID", "COMMENTS", "DATE_CREATE", ]
        },
        function (result) {
            if (result.error()) {
                curapp.displayErrorMessage('Ошибка загрузки сделок!')
            } else {
                const data = result.data();
                console.log(data);

                for (indexDeal in data) {
                    dealHtml += '<div class="dealBlock"><div class="col-sm-8" style="float:left;"><h1>' + data[indexDeal].TITLE + '</h1><div style="font-size:20px;">' + data[indexDeal].OPPORTUNITY + data[indexDeal].CURRENCY_ID + '</div><div>Дата создания: ' + data[indexDeal].DATE_CREATE + '</div>' + '<div>Комментарий: ' + data[indexDeal].COMMENTS + '</div></div>' + '<div class="col-sm-4" style="float:left;"><div id="productItem"></div></div>' + '</div>';
                }

                console.log(data[indexDeal]);

                if (result.more())
                    result.next();
                else {
                    $('#dealList').html(dealHtml);
                }
            }
        }
    );
}

app = new application();