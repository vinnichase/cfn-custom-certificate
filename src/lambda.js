var response = require("cfn-response");
exports.handler = function (event, context) {
    try {
        console.log(JSON.stringify(event));
        var aws = require("aws-sdk");
        var acm = new aws.ACM({ apiVersion: "latest" });
        if (event.RequestType == "Delete") {
            var params = {
                CertificateArn: event.PhysicalResourceId
            };
            acm.deleteCertificate(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                    response.send(event, context, response.FAILED);
                } else {
                    response.send(event, context, response.SUCCESS);
                }
            });
            return;
        } else if (event.RequestType == "Create") {
            var params = {
                DomainName: event.ResourceProperties.DomainName,
                ValidationMethod: event.ResourceProperties.ValidationMethod
            }
            acm.requestCertificate(params, function (err, data) {
                if (err) {
                    response.send(event, context, response.FAILED, { Error: err.message });
                } else {
                    var certificateArn = data.CertificateArn;
                    var params = {
                        CertificateArn: certificateArn
                    };
                    acm.describeCertificate(params, function (err1, data1) {
                        if (err1) {
                            response.send(event, context, response.FAILED, { Error: err1.message });
                        } else {
                            var validationRecord = data1.Certificate.DomainValidationOptions[0].ResourceRecord;
                            var certificateId = certificateArn.split("/")[1];
                            var responseData = {
                                CertificateArn: certificateArn,
                                CertificateId: certificateId,
                                DnsValidationCnameName: validationRecord.Name,
                                DnsValidationCnameValue: validationRecord.Value
                            }

                            var route53 = new aws.Route53();

                            var params = {
                                ChangeBatch: {
                                    Changes: [
                                        {
                                            Action: "CREATE",
                                            ResourceRecordSet: {
                                                Name: validationRecord.Name,
                                                ResourceRecords: [
                                                    {
                                                        Value: validationRecord.Value
                                                    }
                                                ],
                                                TTL: 300,
                                                Type: "CNAME"
                                            }
                                        }
                                    ],
                                    Comment: "Validation Record for domain certificate "
                                },
                                HostedZoneId: event.ResourceProperties.HostedZoneId
                            };

                            route53.changeResourceRecordSets(params, function (err2, data2) {
                                if (err2) {
                                    response.send(event, context, response.FAILED, { Error: err2.message });
                                } else {
                                    console.log(responseData);
                                    response.send(event, context, response.SUCCESS, responseData, certificateArn);
                                }
                            });
                        }
                    });
                }
            });
        }
    } catch (err) {
        console.log(err)
        response.send(event, context, response.FAILED, { Error: err.message });
    }
};
