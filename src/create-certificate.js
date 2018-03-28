var requestCertificate = require('./acm/request-certificate');
var describeCertificate = require('./acm/describe-certificate');
var deleteCertificate = require('./acm/delete-certificate');
var validateCertificate = require('./route53/validate-certificate');

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

exports.handler = function (event, context) {
    if (event.RequestType == "Delete") {
        var certificateArn = event.PhysicalResourceId;
        deleteCertificate(certificateArn).then(function (data) {
            response.send(event, context, response.SUCCESS, data, event.PhysicalResourceId);
        }).catch(function (err) {
            response.send(event, context, response.FAILED, { Error: err.message }, event.PhysicalResourceId);
        });
    } else if (event.RequestType == "Create") {
        var domainName = event.ResourceProperties.DomainName;
        var validationMethod = event.ResourceProperties.ValidationMethod;
        var hostedZoneId = event.ResourceProperties.HostedZoneId;
        createCertificate(domainName, validationMethod, hostedZoneId).then(function (data) {
            response.send(event, context, response.SUCCESS, data, event.PhysicalResourceId);
        }).catch(function (err) {
            response.send(event, context, response.FAILED, { Error: err.message });
        });
    }
};
