import { useState, useEffect } from 'react';
import {
  atan2, chain, derivative, e, evaluate, log, ln, pi, pow, round, sqrt, parse, simplify
} from 'mathjs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import './App.css';

const ejTempData = [24,25,25,26,27,28,28,27,28,26,25,24,23,20,20,20,20,19,20,20,20,20,21,20,21,21,21,21,21,21,21,21,21,20,20,20,20,21,20,20,20,21,20,20,20,20,20,20,19,20,19,20,20,20,21,20,20,21,20,21,20,20,20,21,21,20,20,20,21,20,18,19,19,20,20,21,20,20,20,20,20,21,20,20,19,20,21,21,20,20,20,20,21,21,20,20,20,19,20,20,20,19,20,20,20,21,20,20,20,21,20,20,20,21,20,20,21,21,21,20,20,20,20,19,19,20,20,21,20,20,21,20,21,20,20,21,20,21,20,19,19,20,20,20,21,19,21,19,20,20,20,21,20,20,20,21,20,20,20,20,21,19,19,19,20,20,20,20,21,20,20,19,20,20,19,19,19,19,20,20,20,21,21,21,21,19,20,20,20,21,20,20,20,21,20,20,20,20,21,21,19,20,20,20,20,21,21,21,20,20,20,20,20,21,21,21,20,];
// const ejTempData = [27.4,27.4,27.4,27.5,27.4,27.4,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.4,27.5,27.5,27.5,27.5,27.5,27.4,27.5,27.4,27.5,27.5,27.5,27.5,27.4,27.5,27.5,27.5,27.5,27.4,27.5,27.5,27.5,27.5,27.5,27.4,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.4,27.4,27.5,27.4,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.4,27.5,27.4,27.5,27.5,27.5,27.5,27.5,27.4,27.5,27.5,27.5,27.5,27.5,27.4,27.4,27.4,27.5,27.4,27.4,27.5,27.5,27.5,27.5,27.4,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.4,27.5,27.4,27.5,27.5,27.4,27.4,27.5,27.4,27.5,27.4,27.5,27.4,27.5,27.4,27.5,27.4,27.4,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.5,27.4,27.5,27.5,27.];

const rawTempData = [];

// invento 4 mediciones para simular una hora

for (let i=0;i<ejTempData.length-1;i++) {
  rawTempData.push(ejTempData[i]);
  rawTempData.push(ejTempData[i]);
  rawTempData.push(ejTempData[i]);
  rawTempData.push(ejTempData[i]);
}

const madurezRawData = [];

//la madurez es en horas

for (let i=3;i<rawTempData.length-1;i=i+4) {
    if (i==3) {
      madurezRawData.push(rawTempData[i]);
    } else {
      // console.dir(i);
      // console.dir(madurezData.length-1)
      var lastTemp = madurezRawData[madurezRawData.length-1];
      madurezRawData.push(rawTempData[(i+1)/4]+lastTemp);
    }
}

const g170 = [
  {
    x: 400,
    y2: 48.65
  },
  {
    x: 800,
    y2: 109.15
  },
  {
    x: 1606,
    y2: 170
  },
  {
    x: 2000,
    y2: 189.12
  },
  {
    x: 2500,
    y2: 280.60
  },  
]

const g20 = [
  {
    x: 400,
    y3: 63.02
  },
  {
    x: 800,
    y3: 120.99
  },
  {
    x: 1606,
    y3: 179.30
  },
  {
    x: 2000,
    y3: 197.63
  },
  {
    x: 2500,
    y3: 216.29
  },  
]

const App = () => {

  const [fnValue, setFnValue] = useState('');
  const [fn, setFn] = useState([()=>{}]);
  const [showXYValues, setShowXYValues] = useState();
  const [fnReadOnly, setFnReadOnly] = useState(false);
  const [fnValid, setFnValid] = useState(false);
  const [xValue, setXValue] = useState('');
  const [yArray, setYArray] = useState([]);
  const [xArray, setXArray] = useState([]);
  const [showChart, setShowChart] = useState(true);

  const [data, setData] = useState([]);

  const [madurezSegunFuncion, setMadurezSegunFuncion] = useState([]);

  const [dataG170] = useState(g170);
  const [dataG20] = useState(g20);

  const updateFnValue = (e) => setFnValue(e.target.value);
  const updateXValue = (e) => setXValue(e.target.value);

  useEffect(() => {
      try {
        fn.evaluate({x: 0}); 
        setFnReadOnly(true);
        setFnValid(true);
        setShowXYValues(true);
      }

      catch (e) {
        setFnValid(false);
      }
    }, [fn]);


  const evaluateFn = () => {

    if (fnValue.length>0) {

      setFn(parse(fnValue));

    } else { 
      setFnValid(false);
    }
  }

  const createFValues = () => {
    var floatData = [];
    for (let i=0;i<madurezRawData.length-1;i++) {
      
      floatData.push({ x: parseInt(madurezRawData[i]), y: fn.evaluate({x: madurezRawData[i]})});
      
    }

    setMadurezSegunFuncion(floatData);

  }


  const addXValue = () => {

    if (xValue.length>0) {

      setXArray(xArray => [...xArray, xValue]);
      setYArray(yArray => [...yArray, (fn.evaluate({x: xValue}))]);

      

      setData(data => [...data, { x: parseInt(xValue), y2: fn.evaluate({x: xValue})}]);

      setXValue('');

    } else {

    }

  }

  // const getAxisYDomain = (from, to, ref, offset) => {
  //   const refData = tempData.slice(from - 1, to);
  //   let [bottom, top] = [refData[0][ref], refData[0][ref]];
  //   refData.forEach((d) => {
  //     if (d[ref] > top) top = d[ref];
  //     if (d[ref] < bottom) bottom = d[ref];
  //   });

  //   return [(bottom | 0) - offset, (top | 0) + offset];
  // };


  // const zoom = () => {

  //   console.dir('zoom');
  //   // let tempRefAreaLeft = refAreaLeft;
  //   // let tempRefAreaRight = refAreaRight;
    
  //   // const tempDate = data;

  //   if (refAreaLeft === refAreaRight || refAreaRight === '') {
  //     setRefAreaLeft('');
  //     setRefAreaRight('');
  //     return;
  //   }

  //   // xAxis domain
  //   if (refAreaLeft > refAreaRight) {
  //     setRefAreaRight(refAreaLeft);
  //     setRefAreaLeft(refAreaRight);
  //   }


  //   // yAxis domain
  //   const [bottom, top] = getAxisYDomain(refAreaLeft, refAreaRight, 'y', 1);
  //   const [bottom2, top2] = getAxisYDomain(refAreaLeft, refAreaRight, 'y', 50);

  //   setRefAreaLeft('');
  //   setRefAreaRight('');
  //   setTempData(tempData.slice());
  //   left = refAreaLeft;
  //   right = refAreaLeft;

  //   // this.setState(() => ({
  //   //   refAreaLeft: '',
  //   //   refAreaRight: '',
  //   //   data: data.slice(),
  //   //   left: refAreaLeft,
  //   //   right: refAreaRight,
  //   //   bottom,
  //   //   top,
  //   //   bottom2,
  //   //   top2,
  //   // }));
  // }


  // render() {
  return (
    <div className="App" style={{userSelect: 'none'}}>
      <div className="container-fluid">
        <div className="row">
          <div className="col mt-3">
            <form>
              <div className="form-group">
                <label htmlFor="function">Función</label>
                <input type="text" className={fnValid ? "form-control is-valid" : "form-control is-invalid"} readOnly={fnReadOnly} value={fnValue} onChange={updateFnValue} />
              </div>
              <span className="btn btn-primary" id="parse" onClick={evaluateFn}>Evaluar</span>
            </form>

            {showXYValues && <form className="mt-2">

              {/* <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">x:</span>
                </div>
                <input type="text" className="form-control" placeholder="x" value={xValue} onChange={updateXValue}/>
              </div> */}

              <span className="btn btn-primary" onClick={createFValues}>Graficar</span>
              {/* <span className="btn btn-primary ml-1" onClick={addXValue}>Agregar</span>
              <span className="btn btn-primary ml-1" onClick={createFValuesDebil}>Agregar ejercicio - random</span> */}

              {/* <div className="form-group pt-3">
                <input className="form-control mt-1" value={xArray} type="text" readOnly/>
                <input className="form-control mt-1" value={yArray} type="text" readOnly/>
              </div> */}


            </form>}

            {showChart &&

              <ResponsiveContainer width="100%" height={500} className="mt-5">
                <LineChart
                  width={500}
                  height={300}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 100,
                    bottom: 5,
                  }}>
                  {/* onMouseDown={(e) => setRefAreaLeft(e.activeLabel)}
                  onMouseMove={(e) => refAreaLeft && setRefAreaRight(e.activeLabel)}
                  onMouseUp={zoom}> */}
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" type="number" />
                  <YAxis type="number" yAxisId="1" allowDecimals={false} />
                  <Tooltip />
                  
                  <Line yAxisId="1" type="natural" data={madurezSegunFuncion} dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} />

                  <Line yAxisId="1" type="natural" data={dataG170} dataKey="y2" stroke="#82ca9d" activeDot={{ r: 8 }} />

                  <Line yAxisId="1" type="natural" data={dataG20} dataKey="y3" stroke="#ff0000" activeDot={{ r: 8 }} />

                  {/*refAreaLeft && refAreaRight ? (
                    <ReferenceArea yAxisId="1" x1={refAreaLeft} x2={refAreaRight2} strokeOpacity={0.3} />
                  ) :  null */}

                </LineChart>
              </ResponsiveContainer>
            
            }

          </div>
        </div>

      </div>

    </div>
  );

  // }

{  }

}

export default App;
