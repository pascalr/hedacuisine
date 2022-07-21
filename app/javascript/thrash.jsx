//const TrainFilter = ({page, recipeFilters}) => {
//
//  const filter = page && page.filterId ? recipeFilters.find(f => f.id == page.filterId) : null
//  if (!filter) {console.log("Can't train filter, did not exist."); return '';}
//  
//  const [dataToTrain, setDataToTrain] = useState([])
//  const [selected, setSelected] = useState({})
//  const [doneFetching, setDoneFetching] = useState(false)
//
//  const fetchBatch = () => {
//    ajax({url: missing_filtered_recipes_path({recipe_filter_id: filter.id}), type: 'GET', success: (data) => {
//      if (!data || data == []) {
//        console.log('done fetching received ', data)
//        setDoneFetching(true)
//      }
//      setSelected({})
//      setDataToTrain(data)
//    }})
//  }
//
//  useEffect(() => {
//    fetchBatch()
//  }, [])
//
//  const submitData = () => {
//    let data = dataToTrain.map((d,i) => ({filterable_type: d.class_name, filterable_id: d.id, selected: selected[i]}))
//    ajax({url: batch_create_filtered_recipes_path(), type: 'POST', data: {recipe_filter_id: filter.id, data: JSON.stringify(data)}, success: () => {
//      console.log('Fetching second batch of data')
//      fetchBatch()
//    }, error: (err) => {
//      console.log('Error sending training data', err)
//    }})
//  }
//              
//  const imageClicked = (nb) => {
//    let s = {...selected}
//    s[nb] = !s[nb]
//    setSelected(s)
//  }
//
//  if (!dataToTrain || dataToTrain.length <= 0) {return <p>Il ne reste plus aucune recette ou catégorie à entrainer.</p>}
//
//  return (<>
//    <h2 style={{textAlign: 'center'}}>Quelle recette correspond à {filter.name} ?</h2>
//    <table>
//      <tbody>
//        {[0,1,2,3,4].map(i => {
//          return (<tr key={i}>
//            {[0,1,2,3].map(j => {
//              let nb = j*5+i
//              let record = dataToTrain[nb]
//              if (!record) {return <td key={j}></td>}
//              return (<td key={j}>
//                <div className="over-container clickable" style={{margin: "auto", border: `4px solid ${selected[nb] ? 'blue' : 'white'}`}} onClick={() => imageClicked(nb)}>
//                  <img src={record.image_id ? image_variant_path({id: record.image_id}, "small") : "/default_recipe_01.png"} width="255" height="171" />
//                  <h2 className="bottom-center font-satisfy" style={{borderRadius: "0.5em", border: "1px solid #777", color: "#333", bottom: "1em", backgroundColor: "#f5f5f5", fontSize: "1.2em", padding: "0.2em 0.8em 0 0.2em"}}>{record.name}</h2>
//                </div>
//              </td>)
//            })}
//          </tr>)
//        })}
//      </tbody>
//    </table>
//    <br/>
//    <button type="button" className="btn btn-primary" onClick={submitData}>Soumettre</button>
//  </>)
//  
//  //return (<>
//  //  <div>
//  //    <h2 style={{textAlign: 'center'}}>Entraîner: {filter.name}</h2>
//  //    <div className="over-container" style={{margin: "auto"}}>
//  //      <img src={record.image_id ? image_variant_path({id: record.image_id}, "medium") : "/default_recipe_01.png"} style={{maxWidth: "100vw"}} width="452" height="304" />
//  //      <h2 className="bottom-center font-satisfy" style={{borderRadius: "0.5em", border: "1px solid #777", color: "#333", bottom: "1em", backgroundColor: "#f5f5f5", fontSize: "2em", padding: "0.2em 0.8em 0 0.2em"}}>{record.name}</h2>
//  //    </div>
//  //    <div>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>1</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>2</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>3</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>4</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>5</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>6</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>7</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>8</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>9</button>
//  //      <button type="button" className="btn btn-primary" onClick={() => {}}>10</button>
//  //    </div>
//  //  </div>
//  //</>)
//}
//
