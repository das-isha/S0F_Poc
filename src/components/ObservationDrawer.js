import React from "react";
import { requestObservation, getObservationDemo } from "../javascript/api";
import { Drawer, Descriptions, Skeleton, message } from "antd";
import ReactJson from "react-json-view";
import { GlobalContext } from "../components/GlobalContext";
import { Line, Pie } from "react-chartjs-2";

const keyGen = () => {
  let r = Math.random().toString(36).substring(7);
  return r;
};

// to match all kinds of values, see https://www.hl7.org/fhir/observation.html
const findValueKey = (observation) => {
  let key,
    keys = [];
  let filter = new RegExp("value.*|component", "g");
  for (key in observation) {
    if (observation.hasOwnProperty(key) && filter.test(key)) keys.push(key);
  }
  return keys[0];
};

class ObservationDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      observation: null,
    };
  }

  static contextType = GlobalContext;

  // load observation
  async componentDidUpdate() {
    if (this.props.patient && !this.state.observation) {
      let json;
      try {
        json = await requestObservation(this.props.patient.resource.id);
      } catch (e) {
        json = getObservationDemo();
        message.warn({
          content: "Network Error, the server might be down. Local demo data is loaded.",
          duration: 2,
        });
      }

      this.setState({
        loading: false,
        observation: json,
        rawDataDrawer: false,
        rawDataDrawerData: null,
      });
    }
  }

  onClose = () => {
    this.setState({
      loading: true,
      observation: null,
    });
    console.log(this.state);
    this.props.onClose();
  };

  onChildrenDrawerClose = () => {
    this.setState({
      rawDataDrawer: false,
    });
  };

  openRawDataDrawer = (data) => {
    this.setState({
      rawDataDrawer: true,
      rawDataDrawerData: data,
    });
  };

  render() {
    const { visible } = this.props;
    const patient = this.props.patient && this.props.patient.resource;

    const ViewRawBtn = (props) => {
      return (
        <div style={{ margin: "auto", textAlign: "center", padding: "10px 0" }}>
          <a
            onClick={() => {
              this.openRawDataDrawer(props.object);
            }}
            disabled={this.props.loading}
          >
            <b>View Raw FHIR Data</b>
          </a>
        </div>
      );
    };

    let observations =
      this.state.observation &&
      this.state.observation.map((entry) => {
        let obs = entry.resource;
        let valueKey = findValueKey(obs);
        let valueItems;
        if (valueKey) {
          valueItems = Object.keys(obs[valueKey]).map((key) => {
            if (key === "coding" || key === "system" || key === "code") return;
            const value = obs[valueKey][key] + "";
            return (
              <Descriptions.Item key={keyGen()} label={<b>{key}</b>}>
                {value}
              </Descriptions.Item>
            );
          });

          if (valueKey === "component") {
            // special case - blood pressure
            valueItems = obs.component.map((blood) => {
              return (
                <Descriptions.Item key={keyGen()} label={<b>{blood.code?.text}</b>}>
                  <span style={{ fontWeight: "bold" }}>{blood.valueQuantity?.value}</span>{" "}
                  <span style={{ fontWeight: "bold" }}>{blood.valueQuantity?.unit}</span>
                </Descriptions.Item>
              );
            });
          }
        }
        return (
          <div key={keyGen()} style={{ wordBreak: "break-all" }}>
            <Descriptions
              bordered={true}
              layout={this.context.isMobile ? "horizontal" : "vertical"}
              key={keyGen()}
              title={<b>{obs.code.text}</b>}
              column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
              <Descriptions.Item key={keyGen()} label={<b>ID</b>}>
                {obs.id}
              </Descriptions.Item>
              {valueItems}
              <Descriptions.Item key={keyGen()} label={<b>Category</b>}>
                {obs.category?.[0]?.coding?.[0].display}
              </Descriptions.Item>
              <Descriptions.Item key={keyGen()} label={<b>issued</b>}>
                {obs.issued}
              </Descriptions.Item>
              <Descriptions.Item key={keyGen()} label={<b>effectiveDateTime</b>}>
                {obs.effectiveDateTime}
              </Descriptions.Item>
            </Descriptions>

            <ViewRawBtn object={obs}></ViewRawBtn>
          </div>
        );
      });

    // Blood Pressure Data
    const bloodPressureData = {
      labels: ["Jan 2012", "Feb 2013", "Jan 2014", "Jan 2015", "Feb 2016", "Jan 2017", "Jan 2018", "April 2019", "Jan 2021"],
      datasets: [
        {
          label: "Systolic",
          data: [120, 125, 122, 128, 130, 126, 120, 142, 138],
          fill: false,
          borderColor: "red",
        },
        {
          label: "Diastolic",
          data: [80, 82, 81, 85, 87, 84, 86, 89, 85],
          fill: false,
          borderColor: "blue",
        },
      ],
    };

    // Blood Pressure Pie Chart Data
    const bloodPressurePieData = {
      labels: ["Normal", "Stage 1", "Stage 2", "Critical"],
      datasets: [
        {
          data: [8, 4, 3, 0],
          backgroundColor: ["green", "yellow", "orange", "red"],
        },
      ],
    };

    return (
      <Drawer
        title={<b>Patient Observation</b>}
        placement="right"
        closable={true}
        onClose={this.onClose}
        visible={visible}
        width={this.context.isMobile ? "100%" : "60%"}
      >
        {patient && (
          <div key={keyGen()}>
            <Descriptions title={<b>Patient Basic Info</b>}>
              <Descriptions.Item key={keyGen()} label={<b>Name</b>}>
                {`${patient.name[0]?.family} ${patient.name[0]?.given?.[0]} (${patient.name[0]?.prefix?.[0]})`}
              </Descriptions.Item>
              <Descriptions.Item key={keyGen()} label={<b>ID</b>}>
                {patient.id}
              </Descriptions.Item>
              <Descriptions.Item key={keyGen()} label={<b>Telephone</b>}>
                {patient.telecom[0].value}
              </Descriptions.Item>
              <Descriptions.Item key={keyGen()} label={<b>Birth Date</b>}>
                {patient.birthDate}
              </Descriptions.Item>
              <Descriptions.Item key={keyGen()} label={<b>Address</b>}>
                {`${patient.address[0].line[0]}, ${patient.address[0].city}, ${patient.address[0].state}, ${patient.address[0].country}`}
              </Descriptions.Item>
            </Descriptions>
            <ViewRawBtn object={patient}></ViewRawBtn>

            {/* Blood Pressure Line Graph */}
            <Line
              data={bloodPressureData}
              options={{
                scales: {
                  x: {
                    display: true,
                    title: {
                      display: true,
                      text: "Year",
                      color: "black",
                      font: {
                        weight: "bold",
                      },
                    },
                  },
                  y: {
                    display: true,
                    title: {
                      display: true,
                      text: "Blood Pressure",
                      color: "black",
                      font: {
                        weight: "bold",
                      },
                    },
                  },
                },
              }}
            />

            {/* Blood Pressure Pie Chart */}
            <Pie data={bloodPressurePieData} />

            {observations ? (
              observations
            ) : (
              <div>
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
              </div>
            )}
          </div>
        )}

        <Drawer
          title={<b>Raw FHIR Data</b>}
          width={this.context.isMobile ? "100%" : "50%"}
          closable={true}
          onClose={this.onChildrenDrawerClose}
          visible={this.state.rawDataDrawer}
        >
          <ReactJson src={this.state.rawDataDrawerData} />
        </Drawer>
      </Drawer>
    );
  }
}

export default ObservationDrawer;
