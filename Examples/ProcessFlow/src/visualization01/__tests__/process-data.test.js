import * as Data from '../process-data'
import * as Types from '../element-types'
import * as ActivityGroup from '../group-label'

//const { testEnvironment } = require('../../../jest.config')

const config = {
  width: '1500px',
  height: '600px',
  element: 'visualisation01_element_guid',
  functions: {
  },
  data :
  {
    "process": {"id": "55-786B4C023FBE4FF0884ABAAA1B16C640", "name": "BP 150 - Managing Support Impacts in Response to Design Change", "version": "1.0"}, 
    "actors": [
        {
          "id": "41-94FE1E0498464A59804D850FC12498B4", 
          "target": {"id": "55-2FF0F06AFD054E1ABC21BBA52996E9FF", "name": "Design Change Owner (DCO)", "navigable": true}
        },
        {
          "id": "41-2BB2828043914E21B863F72F6D1AE48C", 
          "target": {"id": "55-9FDC37967E4C4E74918A1D25401E39F0", "name": "Actor 2", "navigable": true}
        },
        {
          "id": "41-870B2A59DE204422AA61C1593671897D", 
          "target": {"id": "55-722A10AC709945C0AE5E07C7A0F28149", "name": "Actor 3", "navigable": true}
        },
        {
          "id": "41-4E42523538254751B72C0C68466E25B9", 
          "target": {"id": "55-061D10BE8B07404CAFAEB28CB348AEC7", "name": "Actor 4", "navigable": true}
        }
      ], 
      "phases": [
        {"id": "55-ED9AC05F80864AC8A286A611B42BC74E", "name": "Phase 1 - Identification and Definition of Support Influence and Chane Requirements", "navigable": false},
        {"id": "55-E5B7A48733084BCCAC0B85FB5FB84D25", "name": "Phase 2 - Produce and Approve ILS Plan", "navigable": false},
        {"id": "55-7422D300EE914A9FA03B61068CAC165E", "name": "Phase 3 - Manage Development and Delivery of Support Changes", "navigable": false},
        {"id": "55-35C96AF9C01E45D0AE4182E9B5798495", "name": "Phase 4 - Initial Supportability Approvals", "navigable": false},
        {"id": "55-4EE70459084D402799F66DC7BED89A23", "name": "Phase 5 -Close Out Remaining Safety Case and Supportaility Case Requirements", "navigable": false}
      ], 
      "steps": [
        {
          "id": "55-AE799E8D25B34ED785C3E1AC89829187", 
          "name": "Start", 
          "type": "Start", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-2FF0F06AFD054E1ABC21BBA52996E9FF", "name": "Design Change Owner (DCO)"}}], 
          "phase": {"id": "55-ED9AC05F80864AC8A286A611B42BC74E", "name": "Phase 1 - Identification and Definition of Support Influence and Chane Requirements"}
        },
        {
          "id": "55-EDA64F5D700E459AB025DCC792FFFDE8", 
          "name": "01. Capture Support impacts", 
          "type": "Process Step", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-2FF0F06AFD054E1ABC21BBA52996E9FF", "name": "Design Change Owner (DCO)"}}], 
          "phase": {"id": "55-ED9AC05F80864AC8A286A611B42BC74E", "name": "Phase 1 - Identification and Definition of Support Influence and Chane Requirements"}
        },
        {
          "id": "55-0EC24709DD1949CBBAADDBC4E7330FA6", 
          "name": "02. Coordinate definition and agreement of Support influence and change requirements including implementation timescales and approval routes.", 
          "type": "Process Step", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-2FF0F06AFD054E1ABC21BBA52996E9FF", "name": "Design Change Owner (DCO)"}}], 
          "phase": {"id": "55-ED9AC05F80864AC8A286A611B42BC74E", "name": "Phase 1 - Identification and Definition of Support Influence and Chane Requirements"}
        },
        {
          "id": "55-AAA4CE5C9A9D46278DE6636590B616E8", 
          "name": "03. Allocate and agree delivery responsibilities and associated planning assumptions for Support influence and change requirements with Support Element Owners.", 
          "type": "Process Step", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-2FF0F06AFD054E1ABC21BBA52996E9FF", "name": "Design Change Owner (DCO)"}}], 
          "phase": {"id": "55-ED9AC05F80864AC8A286A611B42BC74E", "name": "Phase 1 - Identification and Definition of Support Influence and Chane Requirements"}
        },
        {
          "id": "55-F8E527E4DBA8440EBEA42B07923E6F19", 
          "name": "04. Produce plan and schedule for development and implementation of Support Element influences / changes.", 
          "type": "Process Step", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-9FDC37967E4C4E74918A1D25401E39F0", "name": "Actor 2"}}], 
          "phase": {"id": "55-E5B7A48733084BCCAC0B85FB5FB84D25", "name": "Phase 2 - Produce and Approve ILS Plan"}
        },
        {
          "id": "55-7E08DD8442A34C52B56A3A1EFF7370FB", 
          "name": "05. Integrate Support Element and design change plans. Resolve issues. Produce ILS Plan. Incorporate Support influences in design plans.", 
          "type": "Process Step", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-2FF0F06AFD054E1ABC21BBA52996E9FF", "name": "Design Change Owner (DCO)"}}], 
          "phase": {"id": "55-E5B7A48733084BCCAC0B85FB5FB84D25", "name": "Phase 2 - Produce and Approve ILS Plan"}
        },
        {
          "id": "55-8226A2C5C8844B62A56CD68A3A55BE29", 
          "name": "06. Review ILS Plan. Assess coherence with other change activities and impacts on Supportability Case. Initiate appropriate actions.", 
          "type": "Process Step", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-722A10AC709945C0AE5E07C7A0F28149", "name": "Actor 3"}}], 
          "phase": {"id": "55-E5B7A48733084BCCAC0B85FB5FB84D25", "name": "Phase 2 - Produce and Approve ILS Plan"}
        },
        {
          "id": "55-4FBEEDF46D874A70884865EE2ABC40EC", 
          "name": "07. Update ILS Plan as required.", 
          "type": "Process Step", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-2FF0F06AFD054E1ABC21BBA52996E9FF", "name": "Design Change Owner (DCO)"}}], 
          "phase": {"id": "55-E5B7A48733084BCCAC0B85FB5FB84D25", "name": "Phase 2 - Produce and Approve ILS Plan"}
        },
        {
          "id": "55-F067D2FE473D4073A01B2CCB73B7DC4E", 
          "name": "08. Confirm Commercial and Financial Approvals for the ILS Plan.", 
          "type": "Process Step", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-2FF0F06AFD054E1ABC21BBA52996E9FF", "name": "Design Change Owner (DCO)"}}], 
          "phase": {"id": "55-E5B7A48733084BCCAC0B85FB5FB84D25", "name": "Phase 2 - Produce and Approve ILS Plan"}
        },
        {
          "id": "55-642762176D414F83B74A357463B117CC", 
          "name": "09. Incorporate any Main Gate outcomes, baseline and release ILS Plan.  Authorise Support Element owners to proceed.", 
          "type": "Process Step", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-2FF0F06AFD054E1ABC21BBA52996E9FF", "name": "Design Change Owner (DCO)"}}], 
          "phase": {"id": "55-7422D300EE914A9FA03B61068CAC165E", "name": "Phase 3 - Manage Development and Delivery of Support Changes"}
        },
        {
          "id": "55-5B731EFB2D9B469AAB8B9ACC664F191C", 
          "name": "10. Commence development of Element changes in accordance with approved Element Plans.", 
          "type": "Process Step", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-9FDC37967E4C4E74918A1D25401E39F0", "name": "Actor 2"}}], 
          "phase": {"id": "55-7422D300EE914A9FA03B61068CAC165E", "name": "Phase 3 - Manage Development and Delivery of Support Changes"}
        },
        {
          "id": "55-DB727D85D512483DB7B7A81C905465FB", 
          "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements.", 
          "type": "Process Step", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-9FDC37967E4C4E74918A1D25401E39F0", "name": "Actor 2"}}], 
          "phase": {"id": "55-7422D300EE914A9FA03B61068CAC165E", "name": "Phase 3 - Manage Development and Delivery of Support Changes"}
        },
        {
          "id": "55-C47A3848DEAC4B0F854F7BEA48CC5B6C", 
          "name": "12. Capture and agree evolving Support Element requirements and delivery plans with Support Element Owners & Update ILS Plan.  Track & manage delivery status against plan and manage technical integration.", 
          "type": "Process Step", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-2FF0F06AFD054E1ABC21BBA52996E9FF", "name": "Design Change Owner (DCO)"}}], 
          "phase": {"id": "55-7422D300EE914A9FA03B61068CAC165E", "name": "Phase 3 - Manage Development and Delivery of Support Changes"}
        },
        {
          "id": "55-DD0305A84CAF4B81A9CA50925A3E1A1A", 
          "name": "13. Ensure technical and schedule coherence across all Support development activities.", 
          "type": "Process Step", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-722A10AC709945C0AE5E07C7A0F28149", "name": "Actor 3"}}], 
          "phase": {"id": "55-7422D300EE914A9FA03B61068CAC165E", "name": "Phase 3 - Manage Development and Delivery of Support Changes"}
        },
        {
          "id": "55-B786779D5C8146FE89F7CEC4107F31F8", 
          "name": "14. Produce and deliver Support Element outputs.  Conduct individual Support Element reviews/V&V as required.", 
          "type": "Process Step", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-9FDC37967E4C4E74918A1D25401E39F0", "name": "Actor 2"}}], 
          "phase": {"id": "55-7422D300EE914A9FA03B61068CAC165E", "name": "Phase 3 - Manage Development and Delivery of Support Changes"}
        },
        {
          "id": "55-97F2A2DE7A6941698EAE78367ED5406B", 
          "name": "15. Is the output required for the CCU?", 
          "type": "Decision", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-9FDC37967E4C4E74918A1D25401E39F0", "name": "Actor 2"}}], 
          "phase": {"id": "55-35C96AF9C01E45D0AE4182E9B5798495", "name": "Phase 4 - Initial Supportability Approvals"}
        },
        {
          "id": "55-FCB0C32F3CE54A2C9DB57D06A1DA4626", 
          "name": "16. Do the ouptputs satisfy CCU requirements?", 
          "type": "Decision", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-061D10BE8B07404CAFAEB28CB348AEC7", "name": "Actor 4"}}], 
          "phase": {"id": "55-35C96AF9C01E45D0AE4182E9B5798495", "name": "Phase 4 - Initial Supportability Approvals"}
        },
        {
          "id": "55-BFED0547719648CA8261D3687CC49D55", 
          "name": "17. Are outputs on track to meet initial supportability req'ts?", 
          "type": "Decision", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-722A10AC709945C0AE5E07C7A0F28149", "name": "Actor 3"}}], 
          "phase": {"id": "55-35C96AF9C01E45D0AE4182E9B5798495", "name": "Phase 4 - Initial Supportability Approvals"}
        },
        {
          "id": "55-B6D3381EC84A4A5BADD1670A19BDD26D", 
          "name": "18. Ensure Supportability Cases are updated. Manage issues and outstanding items to completion for all required Support Element changes.", 
          "type": "Process Step", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-2FF0F06AFD054E1ABC21BBA52996E9FF", "name": "Design Change Owner (DCO)"}}], 
          "phase": {"id": "55-4EE70459084D402799F66DC7BED89A23", "name": "Phase 5 -Close Out Remaining Safety Case and Supportaility Case Requirements"}
        },
        {
          "id": "55-0B2F9131E1CD432592C5874AD5C1B661", 
          "name": "End", 
          "type": "End", 
          "navigable": true, 
          "swimlanes": [{"id": "x", "actor": {"id": "55-2FF0F06AFD054E1ABC21BBA52996E9FF", "name": "Design Change Owner (DCO)"}}], 
          "phase": {"id": "55-4EE70459084D402799F66DC7BED89A23", "name": "Phase 5 -Close Out Remaining Safety Case and Supportaility Case Requirements"}
        }
      ], 
      "stepFlows": [
        {
          "id": "41-1F785FC2ADE74A3A96F6AFDCD37F34A4", 
          "source": {"id": "55-EDA64F5D700E459AB025DCC792FFFDE8", "name": "01. Capture Support impacts"}, 
          "target": {"id": "55-0EC24709DD1949CBBAADDBC4E7330FA6", "name": "02. Coordinate definition and agreement of Support influence and change requirements including implementation timescales and approval routes."}, 
          "label": null, 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-CE6A6B49723D4AB18CAE09027D24CA2A", 
          "source": {"id": "55-0EC24709DD1949CBBAADDBC4E7330FA6", "name": "02. Coordinate definition and agreement of Support influence and change requirements including implementation timescales and approval routes."}, 
          "target": {"id": "55-AAA4CE5C9A9D46278DE6636590B616E8", "name": "03. Allocate and agree delivery responsibilities and associated planning assumptions for Support influence and change requirements with Support Element Owners."}, 
          "label": null, 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-D58E7F32C1B449F8861340435D30EE59", 
          "source": {"id": "55-AAA4CE5C9A9D46278DE6636590B616E8", "name": "03. Allocate and agree delivery responsibilities and associated planning assumptions for Support influence and change requirements with Support Element Owners."}, 
          "target": {"id": "55-F8E527E4DBA8440EBEA42B07923E6F19", "name": "04. Produce plan and schedule for development and implementation of Support Element influences / changes."}, 
          "label": null, 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-E5D0DF14A5F84996922A17BB887A903D", 
          "source": {"id": "55-F8E527E4DBA8440EBEA42B07923E6F19", "name": "04. Produce plan and schedule for development and implementation of Support Element influences / changes."}, 
          "target": {"id": "55-7E08DD8442A34C52B56A3A1EFF7370FB", "name": "05. Integrate Support Element and design change plans. Resolve issues. Produce ILS Plan. Incorporate Support influences in design plans."}, 
          "label": null, 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-3E0757D8FF0C4C93B2DAE70ED1439332", 
          "source": {"id": "55-7E08DD8442A34C52B56A3A1EFF7370FB", "name": "05. Integrate Support Element and design change plans. Resolve issues. Produce ILS Plan. Incorporate Support influences in design plans."}, 
          "target": {"id": "55-8226A2C5C8844B62A56CD68A3A55BE29", "name": "06. Review ILS Plan. Assess coherence with other change activities and impacts on Supportability Case. Initiate appropriate actions."}, 
          "label": null, 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-5D21FDBE0CDD4C9EA74921DD08FE0212", 
          "source": {"id": "55-8226A2C5C8844B62A56CD68A3A55BE29", "name": "06. Review ILS Plan. Assess coherence with other change activities and impacts on Supportability Case. Initiate appropriate actions."}, 
          "target": {"id": "55-4FBEEDF46D874A70884865EE2ABC40EC", "name": "07. Update ILS Plan as required."}, 
          "label": null, 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-38A1ED25EDC64D8F9A2CF32D5AFB814C", 
          "source": {"id": "55-4FBEEDF46D874A70884865EE2ABC40EC", "name": "07. Update ILS Plan as required."}, 
          "target": {"id": "55-F067D2FE473D4073A01B2CCB73B7DC4E", "name": "08. Confirm Commercial and Financial Approvals for the ILS Plan."}, 
          "label": null, 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-336F243E760F4AC2B4347E3442F60762", 
          "source": {"id": "55-F067D2FE473D4073A01B2CCB73B7DC4E", "name": "08. Confirm Commercial and Financial Approvals for the ILS Plan."}, 
          "target": {"id": "55-642762176D414F83B74A357463B117CC", "name": "09. Incorporate any Main Gate outcomes, baseline and release ILS Plan.  Authorise Support Element owners to proceed."}, 
          "label": null, 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-B13A40DE3304459895898621CFF59614", 
          "source": {"id": "55-642762176D414F83B74A357463B117CC", "name": "09. Incorporate any Main Gate outcomes, baseline and release ILS Plan.  Authorise Support Element owners to proceed."}, 
          "target": {"id": "55-5B731EFB2D9B469AAB8B9ACC664F191C", "name": "10. Commence development of Element changes in accordance with approved Element Plans."}, 
          "label": null, 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-512DF145E6634EC8902D501AC08340C6", 
          "source": {"id": "55-5B731EFB2D9B469AAB8B9ACC664F191C", "name": "10. Commence development of Element changes in accordance with approved Element Plans."}, 
          "target": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "label": null, 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-766EF52370B74FDFA6FC495D5E86C9F1", 
          "source": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "target": {"id": "55-C47A3848DEAC4B0F854F7BEA48CC5B6C", "name": "12. Capture and agree evolving Support Element requirements and delivery plans with Support Element Owners & Update ILS Plan.  Track & manage delivery status against plan and manage technical integration."}, 
          "label": null, 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-C8547B8F5FCF4CF6AA5B2F083F5F0CEA", 
          "source": {"id": "55-C47A3848DEAC4B0F854F7BEA48CC5B6C", "name": "12. Capture and agree evolving Support Element requirements and delivery plans with Support Element Owners & Update ILS Plan.  Track & manage delivery status against plan and manage technical integration."}, 
          "target": {"id": "55-DD0305A84CAF4B81A9CA50925A3E1A1A", "name": "13. Ensure technical and schedule coherence across all Support development activities."}, 
          "label": null, 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-D572A2373DED4F709CDFF8582A7CA1AB", 
          "source": {"id": "55-C47A3848DEAC4B0F854F7BEA48CC5B6C", "name": "12. Capture and agree evolving Support Element requirements and delivery plans with Support Element Owners & Update ILS Plan.  Track & manage delivery status against plan and manage technical integration."}, 
          "target": {"id": "55-B786779D5C8146FE89F7CEC4107F31F8", "name": "14. Produce and deliver Support Element outputs.  Conduct individual Support Element reviews/V&V as required."}, 
          "label": null, 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-BB1EC855760D473C9CD9C59EDBCF2D60", 
          "source": {"id": "55-DD0305A84CAF4B81A9CA50925A3E1A1A", "name": "13. Ensure technical and schedule coherence across all Support development activities."}, 
          "target": {"id": "55-C47A3848DEAC4B0F854F7BEA48CC5B6C", "name": "12. Capture and agree evolving Support Element requirements and delivery plans with Support Element Owners & Update ILS Plan.  Track & manage delivery status against plan and manage technical integration."}, 
          "label": null, 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-22DA7091E5D74B2BAE928205FC2C0FF3", 
          "source": {"id": "55-B786779D5C8146FE89F7CEC4107F31F8", "name": "14. Produce and deliver Support Element outputs.  Conduct individual Support Element reviews/V&V as required."}, 
          "target": {"id": "55-97F2A2DE7A6941698EAE78367ED5406B", "name": "15. Is the output required for the CCU?"}, 
          "label": null, 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-3B0F6830E77E42DC97DEB565C3A8ADAD", 
          "source": {"id": "55-B6D3381EC84A4A5BADD1670A19BDD26D", "name": "18. Ensure Supportability Cases are updated. Manage issues and outstanding items to completion for all required Support Element changes."}, 
          "target": {"id": "55-0B2F9131E1CD432592C5874AD5C1B661", "name": "End"}, 
          "label": null, 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-CD1D00EA4C804695BD3428F334548BAC", 
          "source": {"id": "55-AE799E8D25B34ED785C3E1AC89829187", "name": "Start"}, 
          "target": {"id": "55-EDA64F5D700E459AB025DCC792FFFDE8", "name": "01. Capture Support impacts"}, 
          "label": null, 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-40F70B8EB63A4E3DBC68031900AEA479", 
          "source": {"id": "55-FCB0C32F3CE54A2C9DB57D06A1DA4626", "name": "16. Do the ouptputs satisfy CCU requirements?"}, 
          "target": {"id": "55-B786779D5C8146FE89F7CEC4107F31F8", "name": "14. Produce and deliver Support Element outputs.  Conduct individual Support Element reviews/V&V as required."}, 
          "label": "No", 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-7083FDEEF7524EB8B85C938EBE8D78BD", 
          "source": {"id": "55-97F2A2DE7A6941698EAE78367ED5406B", "name": "15. Is the output required for the CCU?"}, 
          "target": {"id": "55-BFED0547719648CA8261D3687CC49D55", "name": "17. Are outputs on track to meet initial supportability req'ts?"}, 
          "label": "No", 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-8FA51EA55FA24659A7E2449B38924714", 
          "source": {"id": "55-BFED0547719648CA8261D3687CC49D55", "name": "17. Are outputs on track to meet initial supportability req'ts?"}, 
          "target": {"id": "55-B786779D5C8146FE89F7CEC4107F31F8", "name": "14. Produce and deliver Support Element outputs.  Conduct individual Support Element reviews/V&V as required."}, 
          "label": "No", 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-A8CF3AD3368849669394344C70E85A4B", 
          "source": {"id": "55-97F2A2DE7A6941698EAE78367ED5406B", "name": "15. Is the output required for the CCU?"}, 
          "target": {"id": "55-FCB0C32F3CE54A2C9DB57D06A1DA4626", "name": "16. Do the ouptputs satisfy CCU requirements?"}, 
          "label": "Yes", 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-DB0A63021B0D4B7B879A4A510D07D87E", 
          "source": {"id": "55-FCB0C32F3CE54A2C9DB57D06A1DA4626", "name": "16. Do the ouptputs satisfy CCU requirements?"}, 
          "target": {"id": "55-BFED0547719648CA8261D3687CC49D55", "name": "17. Are outputs on track to meet initial supportability req'ts?"}, 
          "label": "Yes", 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        },
        {
          "id": "41-E95516A6864E46238472BF78A5C25F7D", 
          "source": {"id": "55-BFED0547719648CA8261D3687CC49D55", "name": "17. Are outputs on track to meet initial supportability req'ts?"}, 
          "target": {"id": "55-B6D3381EC84A4A5BADD1670A19BDD26D", "name": "18. Ensure Supportability Cases are updated. Manage issues and outstanding items to completion for all required Support Element changes."}, 
          "label": "Yes", 
          "offPageConnection": false, 
          "offPageOutputLabel": null, 
          "offPageInputLabel": null
        }
      ], 
      "stepInputs": [
        {
          "id": "41-84D0ECDC49E14628833F5313039BBD60", 
          "target": {"id": "55-EDA64F5D700E459AB025DCC792FFFDE8", "name": "01. Capture Support impacts"}, 
          "source": {"id": "55-9BC2B9D274504AFBA75E77E7B8EDD0D1", "name": "BP 101 - Change Impact Assessment Process", "shortName": "BP 101", "type": "Process", "navigable": true}
        },
        {
          "id": "41-8F5AD0AE735449C9B067022959983C22", 
          "target": {"id": "55-F8E527E4DBA8440EBEA42B07923E6F19", "name": "04. Produce plan and schedule for development and implementation of Support Element influences / changes."}, 
          "source": {"id": "55-C550EFDCD52F42378706E3A6EBC9491A", "name": "BP 009 - Changes to Training as a Result of a Design Change", "shortName": "BP 009", "type": "Process", "navigable": true}
        },
        {
          "id": "41-91B0ACF71B01444BA40035821371CF79", 
          "target": {"id": "55-F8E527E4DBA8440EBEA42B07923E6F19", "name": "04. Produce plan and schedule for development and implementation of Support Element influences / changes."}, 
          "source": {"id": "55-41DE0DB9134E4320A67BCCE7BB8D7CF2", "name": "BP 025 - Management of Maintenance Requirements for In-Service Equipment", "shortName": "BP 025", "type": "Process", "navigable": true}
        },
        {
          "id": "41-45CAB34A42BD4B6499F2462EA79E7ED9", 
          "target": {"id": "55-F8E527E4DBA8440EBEA42B07923E6F19", "name": "04. Produce plan and schedule for development and implementation of Support Element influences / changes."}, 
          "source": {"id": "55-1EE68A3FAE4644D0971E71AE660BECFF", "name": "BP 033 - Management of Change", "shortName": "BP 033", "type": "Process", "navigable": true}
        },
        {
          "id": "41-234FFBAF7EC544F39A783AFD15D523CA", 
          "target": {"id": "55-F8E527E4DBA8440EBEA42B07923E6F19", "name": "04. Produce plan and schedule for development and implementation of Support Element influences / changes."}, 
          "source": {"id": "55-798A0D2B5EC4452C84FE95EDA7CEEC2D", "name": "BP 121 - Management of Technical Information (Digital)", "shortName": "BP 121", "type": "Process", "navigable": true}
        },
        {
          "id": "41-76D1F8BFFEB84CD69D44C234D5A07B3F", 
          "target": {"id": "55-F8E527E4DBA8440EBEA42B07923E6F19", "name": "04. Produce plan and schedule for development and implementation of Support Element influences / changes."}, 
          "source": {"id": "55-8508D0864B6F49809B4AD491F7EDF9F7", "name": "BP 140 - Portable Specialised Support Equipment", "shortName": "BP 140", "type": "Process", "navigable": true}
        },
        {
          "id": "41-4A52752512CB4EDA9A5CF89470195E2F", 
          "target": {"id": "55-7E08DD8442A34C52B56A3A1EFF7370FB", "name": "05. Integrate Support Element and design change plans. Resolve issues. Produce ILS Plan. Incorporate Support influences in design plans."}, 
          "source": {"id": "55-963F8ACA658F4E47AE7C9F73A45ADE75", "name": "ILS Plan Template", "shortName": null, "type": "Document / Form", "navigable": false}
        },
        {
          "id": "41-63029C71550440909C672893DB032870", 
          "target": {"id": "55-642762176D414F83B74A357463B117CC", "name": "09. Incorporate any Main Gate outcomes, baseline and release ILS Plan.  Authorise Support Element owners to proceed."}, 
          "source": {"id": "55-9BC2B9D274504AFBA75E77E7B8EDD0D1", "name": "BP 101 - Change Impact Assessment Process", "shortName": "BP 101", "type": "Process", "navigable": true}
        },
        {
          "id": "41-5A798D24E7F042E2B11B65E4D1C8EB91", 
          "target": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "source": {"id": "55-96D087ED594346E4A7C382D14A9A0283", "name": "BP 001 - Modification Update", "shortName": "BP 001", "type": "Process", "navigable": true}
        },
        {
          "id": "41-131752E45491495C904DEE1D78364CC1", 
          "target": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "source": {"id": "55-C550EFDCD52F42378706E3A6EBC9491A", "name": "BP 009 - Changes to Training as a Result of a Design Change", "shortName": "BP 009", "type": "Process", "navigable": true}
        },
        {
          "id": "41-1F9B9859B34C4EB4B1F885CFD7662065", 
          "target": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "source": {"id": "55-6ACA9DA1842245CD822FDC2D23DB2828", "name": "BP 010 - Design Change Procedure", "shortName": "BP 010", "type": "Process", "navigable": true}
        },
        {
          "id": "41-5D2BBEA8D12C42468753B9A396E3A265", 
          "target": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "source": {"id": "55-41DE0DB9134E4320A67BCCE7BB8D7CF2", "name": "BP 025 - Management of Maintenance Requirements for In-Service Equipment", "shortName": "BP 025", "type": "Process", "navigable": true}
        },
        {
          "id": "41-BC06CB5A3A59408A9CF61010EF0BF050", 
          "target": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "source": {"id": "55-1EE68A3FAE4644D0971E71AE660BECFF", "name": "BP 033 - Management of Change", "shortName": "BP 033", "type": "Process", "navigable": true}
        },
        {
          "id": "41-F31F8C59639E45ED80866E92D3A58946", 
          "target": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "source": {"id": "55-798A0D2B5EC4452C84FE95EDA7CEEC2D", "name": "BP 121 - Management of Technical Information (Digital)", "shortName": "BP 121", "type": "Process", "navigable": true}
        },
        {
          "id": "41-DA20D109B1D04F96A1ED854EA732BEA5", 
          "target": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "source": {"id": "55-0FFF541ADB714BEFA3A29A8C8260602A", "name": "BP 124 - Safely Integrating Design Change", "shortName": "BP 124", "type": "Process", "navigable": true}
        },
        {
          "id": "41-C21745F7C2D24E08AC66FCC9B753C94C", 
          "target": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "source": {"id": "55-8508D0864B6F49809B4AD491F7EDF9F7", "name": "BP 140 - Portable Specialised Support Equipment", "shortName": "BP 140", "type": "Process", "navigable": true}
        },
        {
          "id": "41-E873B7E4D8204D088A18FB0B0F35DFAC", 
          "target": {"id": "55-DD0305A84CAF4B81A9CA50925A3E1A1A", "name": "13. Ensure technical and schedule coherence across all Support development activities."}, 
          "source": {"id": "55-786B4C023FBE4FF0884ABAAA1B16C640", "name": "BP 150 - Managing Support Impacts in Response to Design Change", "shortName": "BP 150", "type": "Process", "navigable": true}
        },
        {
          "id": "41-F79EAB2EB7B940EBB9E2FD3928B125FF", 
          "target": {"id": "55-B786779D5C8146FE89F7CEC4107F31F8", "name": "14. Produce and deliver Support Element outputs.  Conduct individual Support Element reviews/V&V as required."}, 
          "source": {"id": "55-C550EFDCD52F42378706E3A6EBC9491A", "name": "BP 009 - Changes to Training as a Result of a Design Change", "shortName": "BP 009", "type": "Process", "navigable": true}
        },
        {
          "id": "41-FA3321DDEF5048A9BDA4D49F3E4C1C11", 
          "target": {"id": "55-B786779D5C8146FE89F7CEC4107F31F8", "name": "14. Produce and deliver Support Element outputs.  Conduct individual Support Element reviews/V&V as required."}, 
          "source": {"id": "55-41DE0DB9134E4320A67BCCE7BB8D7CF2", "name": "BP 025 - Management of Maintenance Requirements for In-Service Equipment", "shortName": "BP 025", "type": "Process", "navigable": true}
        },
        {
          "id": "41-2D3EFA96FAC54B3484B227E04932E8BC", 
          "target": {"id": "55-B786779D5C8146FE89F7CEC4107F31F8", "name": "14. Produce and deliver Support Element outputs.  Conduct individual Support Element reviews/V&V as required."}, 
          "source": {"id": "55-1EE68A3FAE4644D0971E71AE660BECFF", "name": "BP 033 - Management of Change", "shortName": "BP 033", "type": "Process", "navigable": true}
        },
        {
          "id": "41-1C06CC00C0A945D29130E68001C01465", 
          "target": {"id": "55-B786779D5C8146FE89F7CEC4107F31F8", "name": "14. Produce and deliver Support Element outputs.  Conduct individual Support Element reviews/V&V as required."}, 
          "source": {"id": "55-798A0D2B5EC4452C84FE95EDA7CEEC2D", "name": "BP 121 - Management of Technical Information (Digital)", "shortName": "BP 121", "type": "Process", "navigable": true}
        },
        {
          "id": "41-3C9ED86090C54CEE94CA1A1987B60CD0", 
          "target": {"id": "55-B786779D5C8146FE89F7CEC4107F31F8", "name": "14. Produce and deliver Support Element outputs.  Conduct individual Support Element reviews/V&V as required."}, 
          "source": {"id": "55-8508D0864B6F49809B4AD491F7EDF9F7", "name": "BP 140 - Portable Specialised Support Equipment", "shortName": "BP 140", "type": "Process", "navigable": true}
        },
        {
          "id": "41-F7231D7E62E648189617AE4323C42CAB", 
          "target": {"id": "55-97F2A2DE7A6941698EAE78367ED5406B", "name": "15. Is the output required for the CCU?"}, 
          "source": {"id": "55-45DDC82003EF43A893C5F507731ABAB2", "name": "BP 102 - Permissioning and Certificate of Clearance for Use", "shortName": "BP 102", "type": "Process", "navigable": true}
        }
      ], 
      "stepOutputs": [
        {
          "id": "41-B18F7C5EDE3C4782B65A7C6839B7065D", 
          "source": {"id": "55-0EC24709DD1949CBBAADDBC4E7330FA6", "name": "02. Coordinate definition and agreement of Support influence and change requirements including implementation timescales and approval routes."}, 
          "target": {"id": "55-45DDC82003EF43A893C5F507731ABAB2", "name": "BP 102 - Permissioning and Certificate of Clearance for Use", "shortName": "BP 102", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-C033389B816743BE90B0A24A42FACB03", 
          "source": {"id": "55-F8E527E4DBA8440EBEA42B07923E6F19", "name": "04. Produce plan and schedule for development and implementation of Support Element influences / changes."}, 
          "target": {"id": "55-C550EFDCD52F42378706E3A6EBC9491A", "name": "BP 009 - Changes to Training as a Result of a Design Change", "shortName": "BP 009", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-D4E536AA07D246DA809B8F4443195DE3", 
          "source": {"id": "55-F8E527E4DBA8440EBEA42B07923E6F19", "name": "04. Produce plan and schedule for development and implementation of Support Element influences / changes."}, 
          "target": {"id": "55-41DE0DB9134E4320A67BCCE7BB8D7CF2", "name": "BP 025 - Management of Maintenance Requirements for In-Service Equipment", "shortName": "BP 025", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-3CF9FC0483AB43C98CFEE564E3B92D89", 
          "source": {"id": "55-F8E527E4DBA8440EBEA42B07923E6F19", "name": "04. Produce plan and schedule for development and implementation of Support Element influences / changes."}, 
          "target": {"id": "55-1EE68A3FAE4644D0971E71AE660BECFF", "name": "BP 033 - Management of Change", "shortName": "BP 033", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-BFD2289E9FEA44DDA36F5D15B9D438EE", 
          "source": {"id": "55-F8E527E4DBA8440EBEA42B07923E6F19", "name": "04. Produce plan and schedule for development and implementation of Support Element influences / changes."}, 
          "target": {"id": "55-798A0D2B5EC4452C84FE95EDA7CEEC2D", "name": "BP 121 - Management of Technical Information (Digital)", "shortName": "BP 121", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-7FEEFE171FC445D4842177CC0D278F39", 
          "source": {"id": "55-F8E527E4DBA8440EBEA42B07923E6F19", "name": "04. Produce plan and schedule for development and implementation of Support Element influences / changes."}, 
          "target": {"id": "55-8508D0864B6F49809B4AD491F7EDF9F7", "name": "BP 140 - Portable Specialised Support Equipment", "shortName": "BP 140", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-60DB6A0B3D12446583AB4E27A9D8A40A", 
          "source": {"id": "55-7E08DD8442A34C52B56A3A1EFF7370FB", "name": "05. Integrate Support Element and design change plans. Resolve issues. Produce ILS Plan. Incorporate Support influences in design plans."}, 
          "target": {"id": "55-96D087ED594346E4A7C382D14A9A0283", "name": "BP 001 - Modification Update", "shortName": "BP 001", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-24200D9907F14BA6877149AE1E55D69A", 
          "source": {"id": "55-7E08DD8442A34C52B56A3A1EFF7370FB", "name": "05. Integrate Support Element and design change plans. Resolve issues. Produce ILS Plan. Incorporate Support influences in design plans."}, 
          "target": {"id": "55-6ACA9DA1842245CD822FDC2D23DB2828", "name": "BP 010 - Design Change Procedure", "shortName": "BP 010", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-75B5A9CC4F9B4C10905937E714C28843", 
          "source": {"id": "55-7E08DD8442A34C52B56A3A1EFF7370FB", "name": "05. Integrate Support Element and design change plans. Resolve issues. Produce ILS Plan. Incorporate Support influences in design plans."}, 
          "target": {"id": "55-4FB1E9B33DC4448F888AE3186E06B7A0", "name": "BP 100 - Initiation of Design Change", "shortName": "BP 100", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-8A82437B7F684069874F359E2519416A", 
          "source": {"id": "55-7E08DD8442A34C52B56A3A1EFF7370FB", "name": "05. Integrate Support Element and design change plans. Resolve issues. Produce ILS Plan. Incorporate Support influences in design plans."}, 
          "target": {"id": "55-9BC2B9D274504AFBA75E77E7B8EDD0D1", "name": "BP 101 - Change Impact Assessment Process", "shortName": "BP 101", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-250BAFB061BC418BAEEFA0B6CE2ED2BD", 
          "source": {"id": "55-F067D2FE473D4073A01B2CCB73B7DC4E", "name": "08. Confirm Commercial and Financial Approvals for the ILS Plan."}, 
          "target": {"id": "55-9BC2B9D274504AFBA75E77E7B8EDD0D1", "name": "BP 101 - Change Impact Assessment Process", "shortName": "BP 101", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-12DCAD29DA554D9FAC9F3D36380178FF", 
          "source": {"id": "55-642762176D414F83B74A357463B117CC", "name": "09. Incorporate any Main Gate outcomes, baseline and release ILS Plan.  Authorise Support Element owners to proceed."}, 
          "target": {"id": "55-C550EFDCD52F42378706E3A6EBC9491A", "name": "BP 009 - Changes to Training as a Result of a Design Change", "shortName": "BP 009", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-F2D07C443F8547F8842F5BF14BCEBBF9", 
          "source": {"id": "55-642762176D414F83B74A357463B117CC", "name": "09. Incorporate any Main Gate outcomes, baseline and release ILS Plan.  Authorise Support Element owners to proceed."}, 
          "target": {"id": "55-41DE0DB9134E4320A67BCCE7BB8D7CF2", "name": "BP 025 - Management of Maintenance Requirements for In-Service Equipment", "shortName": "BP 025", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-0479FBE86045491BA4161F4311FED4B8", 
          "source": {"id": "55-642762176D414F83B74A357463B117CC", "name": "09. Incorporate any Main Gate outcomes, baseline and release ILS Plan.  Authorise Support Element owners to proceed."}, 
          "target": {"id": "55-1EE68A3FAE4644D0971E71AE660BECFF", "name": "BP 033 - Management of Change", "shortName": "BP 033", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-210E1811CF6C41F5BE4EAEAD4F1A38DE", 
          "source": {"id": "55-642762176D414F83B74A357463B117CC", "name": "09. Incorporate any Main Gate outcomes, baseline and release ILS Plan.  Authorise Support Element owners to proceed."}, 
          "target": {"id": "55-798A0D2B5EC4452C84FE95EDA7CEEC2D", "name": "BP 121 - Management of Technical Information (Digital)", "shortName": "BP 121", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-D60E1BAD4056455EB0091385D7604544", 
          "source": {"id": "55-642762176D414F83B74A357463B117CC", "name": "09. Incorporate any Main Gate outcomes, baseline and release ILS Plan.  Authorise Support Element owners to proceed."}, 
          "target": {"id": "55-8508D0864B6F49809B4AD491F7EDF9F7", "name": "BP 140 - Portable Specialised Support Equipment", "shortName": "BP 140", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-B6BE9B71223A4A3F9DA5C2D366D687DF", 
          "source": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "target": {"id": "55-96D087ED594346E4A7C382D14A9A0283", "name": "BP 001 - Modification Update", "shortName": "BP 001", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-A91B123249A143C0A92FA43C8CBEFC94", 
          "source": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "target": {"id": "55-C550EFDCD52F42378706E3A6EBC9491A", "name": "BP 009 - Changes to Training as a Result of a Design Change", "shortName": "BP 009", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-D9284D63AADF496D8303AA5CC5869365", 
          "source": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "target": {"id": "55-6ACA9DA1842245CD822FDC2D23DB2828", "name": "BP 010 - Design Change Procedure", "shortName": "BP 010", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-0B70D2E6D8D34362A2FFBE3C12EFC4EE", 
          "source": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "target": {"id": "55-41DE0DB9134E4320A67BCCE7BB8D7CF2", "name": "BP 025 - Management of Maintenance Requirements for In-Service Equipment", "shortName": "BP 025", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-6E54C2E640A34B44AABE9DA1B63FDE71", 
          "source": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "target": {"id": "55-1EE68A3FAE4644D0971E71AE660BECFF", "name": "BP 033 - Management of Change", "shortName": "BP 033", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-BF7AE3EA3E5847F9BB1CCAA161A8A695", 
          "source": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "target": {"id": "55-798A0D2B5EC4452C84FE95EDA7CEEC2D", "name": "BP 121 - Management of Technical Information (Digital)", "shortName": "BP 121", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-112AE59A49E64314B626B88DFDAB42F2", 
          "source": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "target": {"id": "55-0FFF541ADB714BEFA3A29A8C8260602A", "name": "BP 124 - Safely Integrating Design Change", "shortName": "BP 124", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-307397E00B1048E8885CBA89044CCCFE", 
          "source": {"id": "55-DB727D85D512483DB7B7A81C905465FB", "name": "11. Update requirements and delivery plans where dependent on maturity of desgin change and other Elements."}, 
          "target": {"id": "55-8508D0864B6F49809B4AD491F7EDF9F7", "name": "BP 140 - Portable Specialised Support Equipment", "shortName": "BP 140", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-2CCC189799F949599BF5553FA67D94AA", 
          "source": {"id": "55-DD0305A84CAF4B81A9CA50925A3E1A1A", "name": "13. Ensure technical and schedule coherence across all Support development activities."}, 
          "target": {"id": "55-786B4C023FBE4FF0884ABAAA1B16C640", "name": "BP 150 - Managing Support Impacts in Response to Design Change", "shortName": "BP 150", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-17065C7D31CB477AB95BFD42D9F187A6", 
          "source": {"id": "55-FCB0C32F3CE54A2C9DB57D06A1DA4626", "name": "16. Do the ouptputs satisfy CCU requirements?"}, 
          "target": {"id": "55-45DDC82003EF43A893C5F507731ABAB2", "name": "BP 102 - Permissioning and Certificate of Clearance for Use", "shortName": "BP 102", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-6578F7E40DC04D1EAA5F4F23287F5233", 
          "source": {"id": "55-BFED0547719648CA8261D3687CC49D55", "name": "17. Are outputs on track to meet initial supportability req'ts?"}, 
          "target": {"id": "55-D038F1E958AC4F29AF992616175528BB", "name": "BP 005 - Compiling an A&A Work Package ", "shortName": "BP 005", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-BEB9654E4B534F958278CCBB635A63C8", 
          "source": {"id": "55-BFED0547719648CA8261D3687CC49D55", "name": "17. Are outputs on track to meet initial supportability req'ts?"}, 
          "target": {"id": "55-B661EC978A6F4DEAB8A946D601D3C3C7", "name": "BP 007 - Addition of an Alteration & Addition (A&A) during a Breach of Moratorium (BOM)", "shortName": "BP 007", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-F141D37EEF7845B8BF835D68A81D9EA2", 
          "source": {"id": "55-BFED0547719648CA8261D3687CC49D55", "name": "17. Are outputs on track to meet initial supportability req'ts?"}, 
          "target": {"id": "55-057B8517797945C79F6243BC36B68738", "name": "BP 008 - Deletion of an Alteration & Addition (A&A) during a Breach of Moratorium (BOM)", "shortName": "BP 008", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-D883E901524B4F319CDC477B346BF4AA", 
          "source": {"id": "55-BFED0547719648CA8261D3687CC49D55", "name": "17. Are outputs on track to meet initial supportability req'ts?"}, 
          "target": {"id": "55-C550EFDCD52F42378706E3A6EBC9491A", "name": "BP 009 - Changes to Training as a Result of a Design Change", "shortName": "BP 009", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-A78D21D7947A4D7BACC719593CAB9A85", 
          "source": {"id": "55-BFED0547719648CA8261D3687CC49D55", "name": "17. Are outputs on track to meet initial supportability req'ts?"}, 
          "target": {"id": "55-6ACA9DA1842245CD822FDC2D23DB2828", "name": "BP 010 - Design Change Procedure", "shortName": "BP 010", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-9D074BE289B44299AE2497C7DADA27CC", 
          "source": {"id": "55-BFED0547719648CA8261D3687CC49D55", "name": "17. Are outputs on track to meet initial supportability req'ts?"}, 
          "target": {"id": "55-F15462F627144ABFB23E075EF54C7570", "name": "BP 012 - Plan, Prepare, Produce an Upkeep Work Package", "shortName": "BP 012", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-D8372792C3124BCB921CB46D852A1624", 
          "source": {"id": "55-BFED0547719648CA8261D3687CC49D55", "name": "17. Are outputs on track to meet initial supportability req'ts?"}, 
          "target": {"id": "55-41DE0DB9134E4320A67BCCE7BB8D7CF2", "name": "BP 025 - Management of Maintenance Requirements for In-Service Equipment", "shortName": "BP 025", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-C08BFFB399414F6F90E3237445CCD03F", 
          "source": {"id": "55-BFED0547719648CA8261D3687CC49D55", "name": "17. Are outputs on track to meet initial supportability req'ts?"}, 
          "target": {"id": "55-B28C9D2B4F0A495F8FFF89D762162E7D", "name": "BP 027 - Managing Planned Support", "shortName": "BP 027", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-5F6E94789B244B53BAEBDC9561F375AC", 
          "source": {"id": "55-BFED0547719648CA8261D3687CC49D55", "name": "17. Are outputs on track to meet initial supportability req'ts?"}, 
          "target": {"id": "55-1EE68A3FAE4644D0971E71AE660BECFF", "name": "BP 033 - Management of Change", "shortName": "BP 033", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-4AA4664485244BC98C39A14A6234E43D", 
          "source": {"id": "55-BFED0547719648CA8261D3687CC49D55", "name": "17. Are outputs on track to meet initial supportability req'ts?"}, 
          "target": {"id": "55-45DDC82003EF43A893C5F507731ABAB2", "name": "BP 102 - Permissioning and Certificate of Clearance for Use", "shortName": "BP 102", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-F0EA6116615D4EB29096E321E7499785", 
          "source": {"id": "55-BFED0547719648CA8261D3687CC49D55", "name": "17. Are outputs on track to meet initial supportability req'ts?"}, 
          "target": {"id": "55-798A0D2B5EC4452C84FE95EDA7CEEC2D", "name": "BP 121 - Management of Technical Information (Digital)", "shortName": "BP 121", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        },
        {
          "id": "41-869E7CD6F44E466D8B34320A38E7B4F9", 
          "source": {"id": "55-BFED0547719648CA8261D3687CC49D55", "name": "17. Are outputs on track to meet initial supportability req'ts?"}, 
          "target": {"id": "55-8508D0864B6F49809B4AD491F7EDF9F7", "name": "BP 140 - Portable Specialised Support Equipment", "shortName": "BP 140", "type": "Process", "navigable": true}, 
          "label": null, 
          "flow": null
        }
      ], 
      "stepGroups": [], 
      "stepGroupSteps": []
  },
  inputs : {
    "highlightNode": ""
  },
  style: {
     "horizontalStepsAllowed": true,
     "horizontalDecisionsAllowed": true,
     "renderProcessHeader": false,
     "renderSwimlaneWatermarks": false,
    "gridSize": 10,
     "verticalStepSeparation": 40,
     "verticalIOSeparation": 10,
     "stepStandoff": 10,
     "ioStandoff": 5,
     "linkLabelStandoff": 70,
     "processHeaderHeight": 20,
     "swimlaneWatermarkSpacing": 600,
     "inputSwimlaneLabel": "Inputs",
     "outputSwimlaneLabel": "Outputs",
     "phaseLabelWidth": 40,
     "stepGroupPadding": 15,
     "elementSizes": {
         "Process Step": {"width": 100, "height": 60},
         "Decision": {"width": 100, "height": 100},
         "Off Page Input": {"width": 100, "height": 60},
         "Off Page Output": {"width": 100, "height": 60},
         "Sub Process": {"width": 100, "height": 60},
         "Process": {"width": 100, "height": 30},
         "Start": {"width": 100, "height": 40},
         "End": {"width": 100, "height": 40},
         "Document / Form": {"width": 100, "height": 40},
         "External Data": {"width": 100, "height": 40},
         "Database / Application": {"width": 100, "height": 40},
         "Data": {"width": 100, "height": 40},
         "Other": {"width": 100, "height": 40}
     },
     "editable": true
    }
}

describe('process-data', () => {
    it('Successful create Data.Process', () => {
      const testObject = new Data.Process(config.data)
  
      expect(testObject.name()).toBe('BP 150 - Managing Support Impacts in Response to Design Change')
      expect(testObject.version()).toBe('1.0')
      expect(testObject.getActorSet().actors().length).toBe(4)
    })

    it('Unsuccessful create Data.Process - unknown actor for Step', () => {
      const actorId = config.data.steps[1].swimlanes[0].actor.id 
      config.data.steps[1].swimlanes[0].actor.id = 'unknown'
      let throwCount = 0

      try {
        const testObject = new Data.Process(config.data)
      }
      catch (e) {
        throwCount++
        expect(e.name).toBe('Error')
        expect(e.message).toBe('Actor \"Design Change Owner (DCO)\" for step \"01. Capture Support impacts\" is undefined')
      }
  
      expect(throwCount).toBe(1)

      config.data.steps[1].swimlanes[0].actor.id = actorId
    })

    it('Unsuccessful create Data.Process - missing element type for Step', () => {
      const elementType = config.data.steps[1].type
      config.data.steps[1].type = null
      let throwCount = 0

      try {
        const testObject = new Data.Process(config.data)
      }
      catch (e) {
        throwCount++
        expect(e.name).toBe('Error')
        expect(e.message).toBe('No element type for step \"01. Capture Support impacts\" defined')
      }
  
      expect(throwCount).toBe(1)

      config.data.steps[1].type = elementType
    })

})
  