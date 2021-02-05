import fetch from 'node-fetch';
import {
    log
} from 'helpers/debug';
import {
    isQzDotCom
} from 'helpers/utils';

const token = 'eyJhbGciOiJIUzUxMiJ9.eyJpbnRlcm5hbCI6InF1YXJ0emlzYW5hcGkifQ.TP_RtuOFXmVN1dQOA1fY2k-1Q3q2VwsP7nr3CmrEtUWwOlGT-Mj0NQLfWA8s7zCxR93l6R_gNbTaAwJABZSTkg';
const domain = isQzDotCom ? 'vent.qz.com' : 'vent.quartz.work';
const url = `https://${domain}/log`;

export default (data) => {
    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
    };

    fetch(url, options)
        .then(res => {
            if (!res.ok) {
                log(`Vent request failed with status: ${res.statusText}`);
            }
        })
        .catch(error => {
            log(`Vent request error: ${error}`);
        });
};