var describeCertificate = require('./acm/describe-certificate');

function observeCertificate(certificateArn) {
    return describeCertificate(certificateArn)
        .then(function (certificate) {
            return certificate.status;
        });
}

module.exports = observeCertificate;
