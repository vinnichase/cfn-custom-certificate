var requestCertificate = require('./acm/request-certificate')
var describeCertificate = require('./acm/describe-certificate')
var validateCertificate = require('./route53/validate-certificate')

function createCertificate(domainName, validationMethod, hostedZoneId) {
    return requestCertificate(domainName, validationMethod)
        .then(function (certificateArn) {
            return describeCertificate(
                certificateArn);
        })
        .then(function (certificate) {
            return validateCertificate(
                hostedZoneId,
                certificate.dnsValidationCnameName,
                certificate.dnsValidationCnameValue);
        });
}

module.exports = createCertificate;
