var aws = require('aws-sdk');

function validateCertificate(hostedZoneId, cnameRecordName, cnameRecordValue) {
    console.log(cnameRecordValue);
    return new Promise(function (resolve, reject) {
        var route53 = new aws.Route53();
        var params = {
            ChangeBatch: {
                Changes: [
                    {
                        Action: "CREATE",
                        ResourceRecordSet: {
                            Name: cnameRecordName,
                            ResourceRecords: [
                                {
                                    Value: cnameRecordValue
                                }
                            ],
                            TTL: 300,
                            Type: "CNAME"
                        }
                    }
                ],
                Comment: "Validation Record for domain certificate"
            },
            HostedZoneId: hostedZoneId
        };
        route53.changeResourceRecordSets(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = validateCertificate;
