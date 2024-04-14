const REMOTE_API =  "https://api.cleoai.cn"
const LOCAL_API = "http://localhost:8000"
const USE_REMOTE = false;

const API_URL = USE_REMOTE ? REMOTE_API : LOCAL_API


var idea_map = {base: {path: ['base']}}
var cur_pnt = "base"

function createIdeaItem(ideaName, ideaDescription, ideaId) {
    var p = document.createElement("p");
    var iname = document.createElement("h1");
    iname.className = "idea-header"
    iname.textContent = ideaName

    var ideaDesc = document.createElement("span")
    ideaDesc.className = "idea-description"
    ideaDesc.textContent = ideaDescription
    p.className = "idea-item";
    p.id = ideaId;

    var childContainer = document.createElement("div")
    childContainer.className = "child-idea-container"

    var btn = document.createElement('button')
    btn.className='idea-btn'
    btn.onclick = (() => expandIdeas(ideaId));
    btn.textContent='Expand'

    p.appendChild(iname)
    p.appendChild(ideaDesc)
    p.appendChild(childContainer)
    p.appendChild(btn)
    return p;
}

const render_path = (path) => {
    var bcumb = document.createElement('div');
    for (let cid of path){
        let idea = idea_map[cid];
        let btn = document.createElement('button');
        btn.onclick = (() => {render_ideas(cid)})
        btn.className = 'breadcrumb-item'
        btn.textContent = cid == 'base' ? 'base' : idea.idea_name
        let slash = document.createElement('span')
        slash.innerText = '/'
        slash.className = 'breadcrumb-slash'
        bcumb.appendChild(btn)
        bcumb.appendChild(slash)
    }
    bcumb.id = 'pathContainer'
    document.getElementById('pathContainer').replaceWith(bcumb)
}

const render_ideas = (ideaId) => {
    var replaced = document.createElement("div");
    replaced.id = "ideaContainer"
    let icnt = document.getElementById("ideaContainer");
    icnt.replaceWith(replaced)
    const ideas = idea_map[ideaId].childs
    for (let cid of ideas){
        idea = idea_map[cid]
        document.getElementById("ideaContainer")
            .appendChild(createIdeaItem(idea.idea_name, idea.idea_description, cid))
    }
    render_path(idea_map[ideaId].path)
}

const set_loading = () => {
    document.getElementById("generateBtnInternal").textContent="Generating..."
    document.getElementById("generateBtn").classList.add("loading")
}

const set_loaded = () => {
    document.getElementById("generateBtn").classList.remove("loading")
    document.getElementById("generateBtnInternal").textContent="Generate Idea"
}

const save_ideas = (par_id, ideas) => {
    let par = idea_map[par_id];
    par.childs = [];
    for (let idea of ideas){
        let new_path = par.path.concat(idea.id)
        par.childs.push(idea.id)
        idea_map[idea.id] = {
            path: new_path,
            ...idea
        };
    }
}

const generateIdea = (idea) => {
    set_loading()
  fetch(`${API_URL}/generate?idea=${encodeURIComponent(idea)}`)
      .then((rsp)=>{
          console.log(rsp)
          let rsp_parsed = rsp.json()
          return rsp_parsed
      })
      .then((data) => {
          set_loaded()
          save_ideas('base', data)
          render_ideas('base')
      })
}

const expandIdeas = (idea_id, instruction) => {
    let idea = idea_map[idea_id];
    let idea_name = idea.idea_name;
    let idea_desc = idea.idea_description;
    set_loading();
    fetch(`${API_URL}/expand?idea_name=${encodeURIComponent(idea_name)}&idea_description=${encodeURIComponent(idea_desc)}`
        +((instruction!=null)?`&instruction=${encodeURIComponent(instruction)}`:''))
        .then((rsp)=>rsp.json())
        .then((data) => {
            set_loaded();
            save_ideas(idea_id, data)
            render_ideas(idea_id)
        })
}
