var $table = $('#table');
        $(function () {
            $('#toolbar').find('select').change(function () {
                var filter = { batch: $(this).val() };
                if ($(this).val() == "") {
                    filter = {};
                }
                $table.bootstrapTable('filterBy', filter);
            });
        });