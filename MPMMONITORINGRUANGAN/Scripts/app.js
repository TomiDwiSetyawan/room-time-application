$(() => {
    async function loadScheduler() {
        try {
            const getData = await ListDataSch();
           
          
            const convertedData = getData.grid.map((item) => (
                {
                    ...item,
                    startDate: formatDateTime(item.startDate),
                    endDate: formatDateTime(item.endDate)

                }))

            //console.log('Getdata', convertedData)

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
                    var form = e.form;
                    form.beginUpdate();

                    //form.option("colCountByScreen", { lg: 1, xs: 1 });
                    //form.getEditor("repeat").option("value", false); 
                    form.itemOption("mainGroup.allDay", "visible", true); 
                    form.itemOption("mainGroup.repeat", "visible", false);
                    //form.itemOption("mainGroup.description", "disabled", true);
                    form.itemOption('mainGroup.Text', 'cssClass', 'MyCssClass'); // add custom css class to Text

                    form.endUpdate();
                },
                onAppointmentAdded(e) {
                    //console.log(e)
                    const { appointmentData: { allDay, description, endDate, startDate, text } } = e

                    const payload = { allDay, description, endDate, startDate, text }
                    //console.log(payload)

                    addDataSchedule(payload)
                    //showToast('Added', e.appointmentData.text, 'success');
                },
                onAppointmentUpdated(e) {
                    console.log(e)
                    const { appointmentData: { IDTHRUANGAN, allDay, description, endDate, startDate, text } } = e

                    const payload = { IDTHRUANGAN, allDay, description, endDate, startDate, text }
                    //console.log(payload)

                    updateDataSchedule(payload)
                },
                onAppointmentDeleted(e) {
                    console.log(e)
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

    loadScheduler(); 
});

function showToast(event, value, type) {
    DevExpress.ui.notify(`${event} "${value}" task`, type, 800);
}

async function ListDataSch() {
    try {
        //$.LoadingOverlay('show')
        const url = `${base_url_home}app/listData`
        const result = await callAjax(url)
       // $.LoadingOverlay('hide')

        return result
    } catch (e) {
        //$.LoadingOverlay('hide')
        console.log(e)
    }
}





async function addDataSchedule(payload) {
    try {
        const url = `${base_url_home}app/AddDataHeaderSchedule`
        const result = await callAjax(url, payload)
        console.log(result)
        if (result.result == 'Berhasil Insert Data') {
            Swal.fire({
                title: 'Informasi',
                text: "Data berhasil ditambahkan.",
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
            text: "Gagal Insert !.",
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
            Swal.fire({
                title: 'Informasi',
                text: "Gagal update !.",
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