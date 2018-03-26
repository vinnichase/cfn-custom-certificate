var aws = require('aws-sdk');

function deleteCertificate(certificateArn) {
    return new Promise(function (resolve, reject) {
        var acm = new aws.ACM({ apiVersion: "latest" });
        var params = {
            CertificateArn: certificateArn
        };
        acm.deleteCertificate(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = deleteCertificate;
