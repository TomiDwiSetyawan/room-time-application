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
                    console.log(e)
                    const { appointmentData: { allDay, description, endDate, startDate, text } } = e

                    const payload = { allDay, description, endDate, startDate, text }
                    console.log(payload)

                    addDataSchedule(payload)
                    //showToast('Added', e.appointmentData.text, 'success');
                },
                onAppointmentUpdated(e) {
                    showToast('Updated', e.appointmentData.text, 'info');
                },
                onAppointmentDeleted(e) {
                    showToast('Deleted', e.appointmentData.text, 'warning');
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
        Swal.fire({
                title: 'Informasi',
                text: "Data berhasil ditambahkan.",
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then((result) => {

                if (result.isConfirmed) {
                    //renderHeaderGrid([])
                }
            });
        //const url = `${base_url_home}app/AddDataHeaderAmortisasi`
        //const result = await callAjax(url, payload)
        //console.log(result)
        //if (result.result == 'Berhasil Insert Data') {
        //    Swal.fire({
        //        title: 'Informasi',
        //        text: "Data berhasil ditambahkan.",
        //        icon: 'success',
        //        confirmButtonColor: '#3085d6',
        //        confirmButtonText: 'OK'
        //    }).then((result) => {

        //        if (result.isConfirmed) {
        //            renderHeaderGrid([])
        //        }
        //    });
        //}
        //else {
        //  Swal.fire({
        //    title: 'Informasi',
        //    text: "$KodeTransaksi dengan $Kategori already exist !.",
        //    icon: 'warning',
        //    confirmButtonColor: '#3085d6',
        //    confirmButtonText: 'OK'
        //  }).then((result) => {

        //    if (result.isConfirmed) {
        //      renderGridMasterSetting();
        //    }
        //  });
        //}
    } catch (e) {
        throw (e)
    }
}
//const data = [
//    {
//        text: 'Website Re-Design Plan',
//        startDate: new Date('2025-02-03T08:00:00.000+07:00'),
//        endDate: new Date('2025-02-03T09:00:00.000+07:00'),
//    }, {
//        text: 'Book Flights to San Fran for Sales Trip',
//        startDate: new Date('2025-02-29T08:00:00.000+07:00'),
//        endDate: new Date('2025-02-29T09:00:00.000+07:00'),
//        allDay: true,
//    }, {
//        text: 'Install New Router in Dev Room',
//        startDate: new Date('2025-02-11T08:00:00.000+07:00'),
//        endDate: new Date('2025-02-11T09:00:00.000+07:00'),
//    }, {
//        text: 'Approve Personal Computer Upgrade Plan',
//        startDate: new Date('2025-09-29T08:00:00.000+07:00'),
//        endDate: new Date('2025-09-29T09:00:00.000+07:00'),
//    }, {
//        text: 'Final Budget Review',
//        startDate: new Date('2025-08-29T08:00:00.000+07:00'),
//        endDate: new Date('2025-08-29T09:00:00.000+07:00'),
//    }, {
//        text: 'New Brochures',
//        startDate: new Date('2025-10-29T08:00:00.000+07:00'),
//        endDate: new Date('2025-10-29T09:00:00.000+07:00'),
//    }, {
//        text: 'Install New Database',
//        startDate: new Date('2025-12-29T08:00:00.000+07:00'),
//        endDate: new Date('2025-12-29T09:00:00.000+07:00'),
//    }, {
//        text: 'Approve New Online Marketing Strategy',
//        startDate: new Date('2025-01-29T08:00:00.000+07:00'),
//        endDate: new Date('2025-01-29T09:00:00.000+07:00'),
//    }, {
//        text: 'Upgrade Personal Computers',
//        startDate: new Date('2025-11-29T08:00:00.000+07:00'),
//        endDate: new Date('2025-11-29T09:00:00.000+07:00'),
//    }, {
//        text: 'SDMS Developer Meeting',
//        startDate: new Date('2025-04-29T08:00:00.000+07:00'), 
//        endDate: new Date('2025-04-29T09:00:00.000+07:00'), 
//    }, {
//        text: 'IT Developer Mulia',
//        startDate: new Date('2025-04-29T09:00:00.000+07:00'),
//        endDate: new Date('2025-04-29T09:30:00.000+07:00'),
//        //allDay: true,
//    }, {
//        text: 'Prepare 2025 Master Plan',
//        startDate: new Date('2025-04-29T14:00:00.000+07:00'),
//        endDate: new Date('2025-04-29T17:00:00.000+07:00'),
//    },
//];
