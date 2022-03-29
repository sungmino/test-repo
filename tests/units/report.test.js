const { expect } = require("chai");
const sinon = require("sinon");
const { assert } = require("chai");

const reportCommon = require("../../commons/report.common");
const reportService = require("../../services/report.service");

describe("Test getRevenueByOfficeInRangeTime function", () => {
    const end_date = "2003-02-01";
    let start_date;
    const paramsFilter = {
        officeCode: "2",
    };
    const resultRawData = [
        {
            officeCode: "2",
            "sum(newtable.priceEach * newtable.quantityOrdered)": 892538.62,
        },
        {
            officeCode: "4",
            "sum(newtable.priceEach * newtable.quantityOrdered)": 40206.2,
        },
        {
            officeCode: "7",
            "sum(newtable.priceEach * newtable.quantityOrdered)": 60767.96,
        },
    ];

    const outputData = [
        {
            officeCode: "2",
            revenue: 892538.62,
        },
        {
            officeCode: "4",
            revenue: 40206.2,
        },
        {
            officeCode: "7",
            revenue: 60767.96,
        },
    ];
    afterEach(() => {
        sinon.restore();
    });
    it("Must getRevenueByOfficeInRangeTime function success with no query string params", async () => {
        sinon.replace(reportCommon, "getRevenueByCondition", sinon.fake.returns(resultRawData));

        const result = await reportService.getRevenueByOfficeInRangeTime();

        expect(result.length).to.equal(outputData.length);
        expect(result[1].revenue).to.equal(outputData[1].revenue);
    });

    it("Must getRevenueByOfficeInRangeTime function success with a time", async () => {
        sinon.replace(reportCommon, "getRevenueByCondition", sinon.fake.returns(resultRawData));

        const result = await reportService.getRevenueByOfficeInRangeTime(start_date, end_date);

        expect(result.length).to.equal(outputData.length);
        expect(result[1].revenue).to.equal(outputData[1].revenue);
    });

    it("Must getRevenueByOfficeInRangeTime function success with paramsFilter", async () => {
        sinon.replace(reportCommon, "getRevenueByCondition", sinon.fake.returns(resultRawData));

        const result = await reportService.getRevenueByOfficeInRangeTime(
            start_date,
            end_date,
            paramsFilter,
        );

        expect(result.length).to.equal(1);
        expect(result[0].revenue).to.equal(outputData[0].revenue);
    });

    it("Must getRevenueByOfficeInRangeTime function fail", async () => {
        try {
            sinon.replace(reportCommon, "getRevenueByCondition", sinon.fake.returns(undefined));

            const result = await reportService.getRevenueByOfficeInRangeTime(
                start_date,
                end_date,
                paramsFilter,
            );
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("Failed, maybe the database is having problems");
        }
    });
});

describe("Test getRevenueByOfficeInRangeTime function", () => {
    const end_date = "2003-03-15";
    let start_date;
    const paramsFilter = {
        productLine: "Classic Cars",
    };
    const resultRawData = [
        {
            officeCode: "1",
            productLine: "Classic Cars",
            "sum(newtable.priceEach * newtable.quantityOrdered)": 40231.62,
        },
        {
            officeCode: "1",
            productLine: "Motorcycles",
            "sum(newtable.priceEach * newtable.quantityOrdered)": 10769.6,
        },
    ];

    const outputData = {
        officeCode: "1",
        total: 2,
        revenues: [
            {
                productLine: "Classic Cars",
                revenue: 40231.62,
            },
            {
                productLine: "Motorcycles",
                revenue: 10769.6,
            },
        ],
    };

    afterEach(() => {
        sinon.restore();
    });
    it("Must getRevenueByProductLineInRangeTimeByOffice function success with no query string params", async () => {
        sinon.replace(reportCommon, "getRevenueByCondition", sinon.fake.returns(resultRawData));

        const result = await reportService.getRevenueByProductLineInRangeTimeByOffice();

        expect(result.total).to.equal(outputData.total);
        expect(result.revenues[1].revenue).to.equal(outputData.revenues[1].revenue);
    });

    it("Must getRevenueByProductLineInRangeTimeByOffice function success with a time", async () => {
        sinon.replace(reportCommon, "getRevenueByCondition", sinon.fake.returns(resultRawData));

        const result = await reportService.getRevenueByProductLineInRangeTimeByOffice(
            start_date,
            end_date,
        );

        expect(result.total).to.equal(outputData.total);
        expect(result.revenues[0].revenue).to.equal(outputData.revenues[0].revenue);
    });

    it("Must getRevenueByProductLineInRangeTimeByOffice function success with paramsFilter", async () => {
        sinon.replace(reportCommon, "getRevenueByCondition", sinon.fake.returns(resultRawData));

        const result = await reportService.getRevenueByProductLineInRangeTimeByOffice(
            start_date,
            end_date,
            paramsFilter,
        );

        expect(result.total).to.equal(1);
        expect(result.filterResult[0].revenue).to.equal(outputData.revenues[0].revenue);
    });

    it("Must getRevenueByProductLineInRangeTimeByOffice function fail", async () => {
        try {
            sinon.replace(reportCommon, "getRevenueByCondition", sinon.fake.returns(undefined));

            const result = await reportService.getRevenueByProductLineInRangeTimeByOffice(
                start_date,
                end_date,
                paramsFilter,
            );
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("Failed, maybe the database is having problems");
        }
    });
});

describe("Test getRevenueOfCustomers function", () => {
    const end_date = "2003-02-01";
    let start_date;
    const paramsFilter = {
        employeeNumber: 1216,
    };
    const resultRawData = [
        {
            employeeNumber: 1216,
            "count(distinct customerNumber)": 1,
            "sum(newtable.priceEach * newtable.quantityOrdered)": 10223.83,
        },
        {
            employeeNumber: 1504,
            "count(distinct customerNumber)": 1,
            "sum(newtable.priceEach * newtable.quantityOrdered)": 10549.01,
        },
    ];

    const outputData = [
        {
            employeeNumber: 1216,
            numberCustomers: 1,
            revenue: 10223.83,
        },
        {
            employeeNumber: 1504,
            numberCustomers: 1,
            revenue: 10549.01,
        },
    ];
    afterEach(() => {
        sinon.restore();
    });
    it("Must getRevenueOfCustomers function success with no query string params", async () => {
        sinon.replace(reportCommon, "calcRevenueOfCustomers", sinon.fake.returns(resultRawData));

        const result = await reportService.getRevenueOfCustomers();

        expect(result.length).to.equal(outputData.length);
        expect(result[1].revenue).to.equal(outputData[1].revenue);
    });

    it("Must getRevenueOfCustomers function success with a time", async () => {
        sinon.replace(reportCommon, "calcRevenueOfCustomers", sinon.fake.returns(resultRawData));

        const result = await reportService.getRevenueOfCustomers(start_date, end_date);

        expect(result.length).to.equal(outputData.length);
        expect(result[1].revenue).to.equal(outputData[1].revenue);
    });

    it("Must getRevenueOfCustomers function success with paramsFilter", async () => {
        sinon.replace(
            reportCommon,
            "calcRevenueOfCustomers",
            sinon.fake.returns([resultRawData[0]]),
        );

        const result = await reportService.getRevenueOfCustomers(
            start_date,
            end_date,
            paramsFilter,
        );

        expect(result.length).to.equal(1);
        expect(result[0].revenue).to.equal(outputData[0].revenue);
    });

    it("Must getRevenueOfCustomers function fail", async () => {
        try {
            sinon.replace(reportCommon, "calcRevenueOfCustomers", sinon.fake.returns(undefined));

            const result = await reportService.getRevenueOfCustomers(
                start_date,
                end_date,
                paramsFilter,
            );
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("Failed, maybe the database is having problems");
        }
    });
});
