var aws = require('aws-sdk');

function requestCertificate(domainName, validationMethod) {
    return new Promise(function (resolve, reject) {
        var acm = new aws.ACM({ apiVersion: "latest" });
        var params = {
            DomainName: domainName,
            ValidationMethod: validationMethod
        }
        acm.requestCertificate(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.CertificateArn);
            }
        });
    });
}

module.exports = requestCertificate;
