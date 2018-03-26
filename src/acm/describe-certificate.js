var aws = require('aws-sdk');

function describeCertificate(certificateArn) {
    return new Promise(function (resolve, reject) {
        var acm = new aws.ACM({ apiVersion: 'latest' });
        var params = {
            CertificateArn: certificateArn
        };
        acm.describeCertificate(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                var validationRecord = data.Certificate.DomainValidationOptions[0].ResourceRecord;
                var certificateId = certificateArn.split('/')[1];
                var result = {
                    status: data.Certificate.Status,
                    certificateArn: certificateArn,
                    certificateId: certificateId,
                    dnsValidationCnameName: validationRecord.Name,
                    dnsValidationCnameValue: validationRecord.Value
                }
                resolve(result);
            }
        });
    });
}

module.exports = describeCertificate;
