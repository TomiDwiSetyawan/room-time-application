var dataPart
let selectedValues = [];
var IDTHRUANGAN;
var npkDataSource = [];
const gridCabang = $("#gridCabang")

var npk = "";
var getData;

async function filterGrid() {
    //console.log(cabang = $('#cabang').text());
    npk = $('#cabang').text();
    console.log(npk)
    ListDataSch(npk);
    console.log(getData)
    loadScheduler();
}

//var cabang = $('#cabang').text();
//var jabatan = $('#jabatan').text();

//const data = await getDataMaster(jabatan, cabang);

$(() => {
    loadScheduler();
    filterGrid()
});


async function loadScheduler() {
    try {
        renderCabang();
        await ListDataSch(npk);
        dataPart = await getNpkList()
        console.log("YEYEYYE", getData)

        const convertedData = getData.grid.map((item) => (
            {
                ...item,
                startDate: formatDateTime(item.startDate),
                endDate: formatDateTime(item.endDate)

            }))

        console.log('Getdata', convertedData)

        //$('#scheduler').dxScheduler({
        //    timeZone: 'Asia/Jakarta',
        //    dataSource: convertedData,
        //    views: ['day', 'week', 'workWeek', 'month'],
        //    currentView: 'week',
        //    startDayHour: 8,
        //    height: 730,
        //    showCurrentTimeIndicator: false,
        //});

        const scheduler = $('#scheduler').dxScheduler({
            timeZone: 'Asia/Jakarta',
            dataSource: convertedData,
            views: ['day', 'week', 'workWeek', 'month'],
            currentView: 'week',
            startDayHour: 8,
            showCurrentTimeIndicator: false,
            height: 730,
            editing: {
                allowAdding: true,
                allowDeleting: true,
                allowUpdating: true,
                allowResizing: true,
                allowDragging: true,
            },
            onAppointmentFormOpening(e) {

                //console.log(e.appointmentData.IDTHRUANGAN)
                IDTHRUANGAN = e.appointmentData.IDTHRUANGAN;

                //console.log(IDTHRUANGAN)
                var form = e.form;
                form.beginUpdate();

                form.option("items", [
                    {
                        itemType: "group",
                        caption: "Detail Meeting",
                        items: [
                            {
                                //dataField: "USERNAME",
                                //editorType: "dxTextBox",
                                //label: { text: "Name Employee" }
                                //{
                                dataField: "npk",
                                editorType: "dxTagBox",
                                label: { text: "Name Employee" },
                                editorOptions: {
                                    readOnly: false,
                                    disabled: false,
                                    dataSource: dataPart,
                                    valueExpr: "ID",
                                    displayExpr: "NPK",
                                    searchEnabled: true,
                                    //showClearButton: true, 
                                    onInitialized: async function (e) {
                                        if (IDTHRUANGAN !== undefined) {
                                            try {
                                                let result = await ListDataDTL(IDTHRUANGAN);
                                                npkDataSource = result.data.map(item => item.ID);
                                                //console.log("npkDataSource setelah async:", npkDataSource);
                                                selectedValues = npkDataSource
                                                selectedValues = npkDataSource.length > 0 ? npkDataSource : [];
                                                e.component.option("value", selectedValues);
                                            } catch (error) {
                                                //console.error("Gagal mengambil data:", error);
                                            }
                                        } else {
                                            npkDataSource = [];
                                            e.component.option("value", npkDataSource);
                                        }
                                    },
                                    value: selectedValues,
                                    onValueChanged: function (e) {
                                        //console.log(e.value)
                                        if (IDTHRUANGAN !== undefined) {
                                            try {
                                                selectedValues = e.value.slice();
                                            } catch (error) {
                                                console.error("Gagal mengambil data:", error);
                                            }
                                        }
                                        //selectedValues = e.value.slice();
                                        selectedValues = e.value;
                                        //console.log("Updated values:", selectedValues); 
                                    }
                                }
                            },

                            {
                                dataField: "text",
                                editorType: "dxTextBox",
                                label: { text: "Meeting Room Name" }
                            },
                            {
                                dataField: "startDate",
                                editorType: "dxDateBox",
                                label: { text: "Start Date" },
                                editorOptions: {
                                    type: "datetime",
                                    displayFormat: "M/d/yyyy, h:mm a"
                                }
                            },
                            {
                                dataField: "endDate",
                                editorType: "dxDateBox",
                                label: { text: "End Date" },
                                editorOptions: {
                                    type: "datetime",
                                    displayFormat: "M/d/yyyy, h:mm a"
                                }
                            },
                            {
                                dataField: "description",
                                editorType: "dxTextArea",
                                label: { text: "Description" }
                            },

                        ]
                    }
                ]);

                form.option("colCountByScreen", { lg: 1, xs: 1 });
                //form.getEditor("repeat").option("value", false); 
                form.itemOption("mainGroup.allDay", "visible", true);
                form.itemOption("mainGroup.repeat", "visible", false);
                //form.itemOption("mainGroup.description", "disabled", true);
                form.itemOption('mainGroup.Text', 'cssClass', 'MyCssClass'); // add custom css class to Text

                form.endUpdate();
            },
            onAppointmentAdded(e) {
                //console.log(e)
                const { appointmentData: { allDay, npk, description, endDate, startDate, text } } = e

                const payload = { allDay, npk, description, endDate, startDate, text }
                //console.log(payload)

                addDataSchedule(payload)
                //showToast('Added', e.appointmentData.text, 'success');
            },
            onAppointmentUpdated(e) {
                //console.log(e)
                const { appointmentData: { IDTHRUANGAN, npk, allDay, description, endDate, startDate, text } } = e

                const payload = { IDTHRUANGAN, npk, allDay, description, endDate, startDate, text }
                //console.log(payload)

                updateDataSchedule(payload)
            },
            onAppointmentDeleted(e) {
                //console.log(e)
                const { appointmentData: { IDTHRUANGAN, description, endDate, startDate, text } } = e

                const payload = { IDTHRUANGAN, description, endDate, startDate, text }
                //console.log(payload)

                deleteDataSchedule(payload)
            },


        }).dxScheduler('instance');

        $('#allow-adding').dxCheckBox({
            text: 'Allow adding',
            value: true,
            onValueChanged(e) {
                scheduler.option('editing.allowAdding', e.value);
            },
        });

        $('#allow-deleting').dxCheckBox({
            text: 'Allow deleting',
            value: true,
            onValueChanged(e) {
                scheduler.option('editing.allowDeleting', e.value);
            },
        });

        $('#allow-updating').dxCheckBox({
            text: 'Allow updating',
            value: true,
            onValueChanged(e) {
                scheduler.option('editing.allowUpdating', e.value);
                dragging.option('disabled', !e.value);
                resizing.option('disabled', !e.value);
            },
        });


        const resizing = $('#allow-resizing').dxCheckBox({
            text: 'Allow resizing',
            value: false,
            onValueChanged(e) {
                scheduler.option('editing.allowResizing', e.value);
            },
        }).dxCheckBox('instance');

        const dragging = $('#allow-dragging').dxCheckBox({
            text: 'Allow dragging',
            value: false,
            onValueChanged(e) {
                scheduler.option('editing.allowDragging', e.value);
            },
        }).dxCheckBox('instance');


    } catch (error) {
        console.error("Error loading scheduler data:", error);
    }
}

function showToast(event, value, type) {
    DevExpress.ui.notify(`${event} "${value}" task`, type, 800);
}

async function ListDataSch(npk) {
    try {
        //$.LoadingOverlay('show')
        const url = `${base_url_home}app/listData?&npk=` + npk
        const result = await callAjax(url)
        // $.LoadingOverlay('hide')
        //console.log("mony", result)
        getData = result;
        return result
    } catch (e) {
        //$.LoadingOverlay('hide')
        console.log(e)
    }
}


//const npkDataSource = [
//    '5433'
//];

async function getNpkList() {
    //listParticipant
    try {
        //$.LoadingOverlay('show')
        const url = `${base_url_home}app/listParticipant`
        const result = await callAjax(url)
        // $.LoadingOverlay('hide')

        return result.data
    } catch (e) {
        //$.LoadingOverlay('hide')
        console.log(e)
    }
}


async function addDataSchedule(payload) {
    try {
        const url = `${base_url_home}app/AddDataHeaderSchedule`
        const result = await callAjax(url, payload)
        //console.log(result)
        if (result.result == 'Berhasil Insert Data') {
            Swal.fire({
                title: 'Informasi',
                text: "Data berhasil ditambahkan.",
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then((result) => {

                if (result.isConfirmed) {
                    location.reload();
                }
            });
        }
        else {
            if (result.result == 'F') {
                Swal.fire({
                    title: 'Informasi',
                    text: "Ruangan sudah di pakai!.",
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then((result) => {

                    if (result.isConfirmed) {
                        location.reload();
                    }
                });
            }
            if (result.result == 'F2') {
                Swal.fire({
                    title: 'Informasi',
                    text: "Karyawan sudah ada meeting di jam itu!.",
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then((result) => {

                    if (result.isConfirmed) {
                        location.reload();
                    }
                });
            }
        }
    } catch (e) {
        throw (e)
    }
}

async function deleteDataSchedule(payload) {
    try {
        const url = `${base_url_home}app/deleteDataHeaderSchedule`
        const result = await callAjax(url, payload)
        console.log(result)
        if (result.result == 'Berhasil Hapus Data') {
            Swal.fire({
                title: 'Informasi',
                text: "Data berhasil dihapus.",
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then((result) => {

                if (result.isConfirmed) {
                    renderHeaderGrid([])
                }
            });
        }
        else {
            Swal.fire({
                title: 'Informasi',
                text: "Gagal hapus data !.",
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then((result) => {

                if (result.isConfirmed) {
                    renderGridMasterSetting();
                }
            });
        }
    } catch (e) {
        throw (e)
    }
}

async function updateDataSchedule(payload) {
    try {
        const url = `${base_url_home}app/updateDataHeaderSchedule`
        const result = await callAjax(url, payload)
        console.log(result)
        if (result.result == 'Berhasil Update Data') {
            Swal.fire({
                title: 'Informasi',
                text: "Data berhasil diupdate.",
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then((result) => {

                if (result.isConfirmed) {
                    renderHeaderGrid([])
                }
            });
        }
        else {
            if (result.result == 'F') {
                Swal.fire({
                    title: 'Informasi',
                    text: "Ruangan sudah di pakai!.",
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then((result) => {

                    if (result.isConfirmed) {
                        location.reload();
                    }
                });
            }
            if (result.result == 'F2') {
                Swal.fire({
                    title: 'Informasi',
                    text: "Karyawan sudah ada meeting di jam itu!.",
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then((result) => {

                    if (result.isConfirmed) {
                        location.reload();
                    }
                });
            }
        }
    } catch (e) {
        throw (e)
    }
}

async function ListDataDTL(IDTHRUANGAN) {
    try {
        //$.LoadingOverlay('show')
        const url = `${base_url_home}app/listDTL?&IDTHRUANGAN=` + IDTHRUANGAN
        const result = await callAjax(url)
        // $.LoadingOverlay('hide')
        npkDataSource = result.data.map(item => item.ID)
        return result
    } catch (e) {
        //$.LoadingOverlay('hide')
        console.log(e)
    }
}

async function renderCabang() {
    const picData = await getNpkList()
    //console.log(picData)
    const dataSource = new DevExpress.data.ArrayStore({
        key: "ID",
        data: picData
    });

    $('#gridCabang').dxDropDownBox({
        //value: '',
        dataSource: dataSource,
        valueExpr: "ID",
        placeholder: '-Select-',
        displayExpr: 'NPK',
        contentTemplate(e) {
            const v = e.component.option('value');
            const $dataGridcb = $('<div>').dxDataGrid({
                dataSource: e.component.getDataSource(),
                columns: ['NPK'],
                hoverStateEnabled: true,
                paging: { enabled: true, pageSize: 10 },
                filterRow: { visible: true },
                scrolling: { mode: 'infinite' },
                height: 400,
                selection: { mode: 'single' },
                selectedRowKeys: v,
                onSelectionChanged(selectedItems) {
                    const keys = selectedItems.selectedRowKeys;
                    e.component.option('value', keys);
                    document.getElementById("cabang").innerHTML = keys

                    $("#gridCabang").dxDropDownBox("instance").close();

                }
            });

            dataGridcb = $dataGridcb.dxDataGrid('instance');

            e.component.on('valueChanged', (args) => {
                const { value } = args;
                dataGridcb.selectRows(value, false);

            });
            return $dataGridcb;
        }
    });
}
