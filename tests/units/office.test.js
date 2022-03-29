const { expect } = require("chai");
const sinon = require("sinon");

const officeService = require("../../services/office.service");
const officeCommon = require("../../commons/office.common");
const employeeCommon = require("../../commons/employee.common");
const { assert } = require("chai");

describe("Test createOfficeByPresident function", () => {
    const input = {
        officeCode: "8",
        city: "London",
        phone: "+44 20 7877 2041",
        addressLine1: "25 Old Broad Street",
        addressLine2: "Level 7",
        state: null,
        country: "UKA",
        postalCode: "EC2N 1HN",
        territory: "EMEA",
    };

    const checkExist = {
        officeCode: "8",
        city: "Ha Noi",
        phone: "+44 20 7877 2041",
        addressLine1: "25 Old Broad Street",
        addressLine2: "Level 7",
        state: null,
        country: "UKA",
        postalCode: "EC2N 1HN",
        territory: "EME",
    };
    afterEach(() => {
        sinon.restore();
    });

    it("Must createOfficeByPresident success", async () => {
        sinon.replace(officeCommon, "getById", sinon.fake.returns(null));
        sinon.replace(officeCommon, "insert", sinon.fake.returns(input));

        const result = await officeService.createOfficeByPresident(input);
        expect(result.officeCode).to.equal("8");
    });

    it("Must createOfficeByPresident throw error Office is already created", async () => {
        try {
            sinon.replace(officeCommon, "getById", sinon.fake.returns(checkExist));

            const result = await officeService.createOfficeByPresident(input);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("Office is already created");
        }
    });
});

describe("Test getOfficeById function", () => {
    const input = "8";
    const checkExist = {
        officeCode: "8",
        city: "Ha Noi",
        phone: "+44 20 7877 2041",
        addressLine1: "25 Old Broad Street",
        addressLine2: "Level 7",
        state: null,
        country: "UKA",
        postalCode: "EC2N 1HN",
        territory: "EME",
    };
    afterEach(() => {
        sinon.restore();
    });

    it("Must getOfficeById success", async () => {
        sinon.replace(officeCommon, "getById", sinon.fake.returns(checkExist));

        const result = await officeService.getOfficeById(input);

        expect(result.territory).to.equal("EME");
    });

    it("Must getOfficeById fail and throw error Office was not found", async () => {
        try {
            sinon.replace(officeCommon, "getById", sinon.fake.returns(null));

            const result = await officeService.getOfficeById(input);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("Office was not found");
        }
    });
});

describe("Test getOneOfficeByManager function", () => {
    const input = {
        userInfo: {
            employeeNumber: 1002,
        },
    };
    const checkEmployee = {
        employeeNumber: 1002,
        lastName: "Murphy",
        firstName: "Diane",
        extension: "x5800",
        email: "dmurphy@classicmodelcars.com",
        officeCode: "1",
        reportsTo: 1,
        jobTitle: "President",
    };
    const checkOfficeExist = {
        officeCode: "8",
        city: "Ha Noi",
        phone: "+44 20 7877 2041",
        addressLine1: "25 Old Broad Street",
        addressLine2: "Level 7",
        state: null,
        country: "UKA",
        postalCode: "EC2N 1HN",
        territory: "EME",
    };
    afterEach(() => {
        sinon.restore();
    });

    it("Must getOneOfficeByManager success", async () => {
        sinon.replace(employeeCommon, "getById", sinon.fake.returns(checkEmployee));
        sinon.replace(officeCommon, "getById", sinon.fake.returns(checkOfficeExist));

        const result = await officeService.getOneOfficeByManager(input);

        expect(result.territory).to.equal("EME");
    });

    it("Must getOneOfficeByManager fail and throw error You do not belong to any office to view office information", async () => {
        try {
            sinon.replace(employeeCommon, "getById", sinon.fake.returns(checkEmployee));
            sinon.replace(officeCommon, "getById", sinon.fake.returns(null));

            const result = await officeService.getOneOfficeByManager(input);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal(
                "You do not belong to any office to view office information",
            );
        }
    });
});

describe("Test getAllOfficeByPresident function", () => {
    const paramsFilter = {
        page: 1,
        size: 3,
        orderBy: "officeCode",
        type: "asc",
        searchQuery: "officeCode=8",
    };

    const resultGetAllOffice = {
        page: 1,
        total: 1,
        offices: [
            {
                officeCode: "8",
                city: "Ha Noi",
                phone: "+44 20 7877 2041",
                addressLine1: "25 Old Broad Street",
                addressLine2: "Level 7",
                state: null,
                country: "UKA",
                postalCode: "EC2N 1HN",
                territory: "EME",
            },
        ],
    };

    afterEach(() => {
        sinon.restore();
    });

    it("Must getAllOfficeByPresident success", async () => {
        sinon.replace(officeCommon, "getAll", sinon.fake.returns(resultGetAllOffice));

        const result = await officeService.getAllOfficeByPresident(paramsFilter);
        expect(result.offices[0].territory).to.equal("EME");
        expect(result.offices.length).to.equal(1);
    });

    it("Must getAllOfficeByPresident fail and throw error Some errors occurred while getting all office information", async () => {
        try {
            sinon.replace(officeCommon, "getAll", sinon.fake.returns(undefined));

            const result = await officeService.getAllOfficeByPresident(paramsFilter);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal(
                "Some errors occurred while getting all office information",
            );
        }
    });
});

describe("Test updateOfficeByPresident function", () => {
    const inputBody = {
        city: "London",
        phone: "+44 20 7877 2041",
        addressLine1: "25 Old Broad Street",
        addressLine2: "Level 8",
        state: null,
        country: "UKA",
        postalCode: "EC2N 1HN",
        territory: "EMEAS",
    };
    const officeCodeInput = "8";

    const checkExist = {
        officeCode: "8",
        city: "Ha Noi",
        phone: "+44 20 7877 2041",
        addressLine1: "25 Old Broad Street",
        addressLine2: "Level 7",
        state: null,
        country: "UKA",
        postalCode: "EC2N 1HN",
        territory: "EME",
    };
    afterEach(() => {
        sinon.restore();
    });

    it("Must updateOfficeByPresident success", async () => {
        sinon.replace(officeCommon, "getById", sinon.fake.returns(checkExist));
        sinon.replace(officeCommon, "update", sinon.fake.returns(1));

        const result = await officeService.updateOfficeByPresident(inputBody, officeCodeInput);
        expect(result).to.equal(1);
    });

    it("Must updateOfficeByPresident throw error Can't find Office to update", async () => {
        try {
            sinon.replace(officeCommon, "getById", sinon.fake.returns(null));

            const result = await officeService.updateOfficeByPresident(inputBody, officeCodeInput);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("Can't find Office to update");
        }
    });
});

describe("Test deleteOfficeByPresident function", () => {
    const input = "8";

    const checkExist = {
        officeCode: "8",
        city: "Ha Noi",
        phone: "+44 20 7877 2041",
        addressLine1: "25 Old Broad Street",
        addressLine2: "Level 7",
        state: null,
        country: "UKA",
        postalCode: "EC2N 1HN",
        territory: "EME",
    };
    afterEach(() => {
        sinon.restore();
    });

    it("Must deleteOfficeByPresident success", async () => {
        sinon.replace(officeCommon, "getById", sinon.fake.returns(checkExist));
        sinon.replace(officeCommon, "deleteOffice", sinon.fake.returns(1));

        const result = await officeService.deleteOfficeByPresident(input);
        expect(result).to.equal(1);
    });

    it("Must deleteOfficeByPresident throw error Can't find Office to delete", async () => {
        try {
            sinon.replace(officeCommon, "getById", sinon.fake.returns(null));

            const result = await officeService.deleteOfficeByPresident(input);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("Can't find Office to delete");
        }
    });
});
