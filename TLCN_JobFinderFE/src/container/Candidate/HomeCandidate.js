import React from 'react'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import UserCv from '../system/Cv/UserCv';
import ChangePassword from '../system/User/ChangePassword';
import CandidateInfo from './CandidateInfo';
import ManageCvCandidate from './ManageCvCandidate';
import SettingUser from './SettingUser';
const HomeCandidate = () => {
    return (

        <Switch >
            <React.Fragment>
                <div className="container-scroller">
                    {/* partial:partials/_navbar.html */}

                    {/* partial */}
                    <div className="container-fluid page-body-wrapper">
                        {/* partial:partials/_settings-panel.html */}

                        {/* partial */}
                        {/* partial:partials/_sidebar.html */}

                        {/* partial */}
                        <div className="main-panel">
                            <div className="content-wrapper" style={{ marginLeft: '9%' }}>

                                <Route exact path="/candidate/info" component={CandidateInfo}>

                                </Route>

                                <Route exact path="/candidate/usersetting" component={SettingUser}>

                                </Route>

                                <Route exact path="/candidate/changepassword" component={ChangePassword}>

                                </Route>
                                <Route exact path="/candidate/cv-post/" component={ManageCvCandidate}>

                                </Route>
                                <Route path="/candidate/cv-detail/:id" component={UserCv}>
                                </Route>

                            </div>
                            {/* content-wrapper ends */}
                            {/* partial:partials/_footer.html */}

                            {/* partial */}
                        </div>
                        {/* main-panel ends */}
                    </div>
                    {/* page-body-wrapper ends */}
                </div>
            </React.Fragment>
        </Switch >

    )
}

export default HomeCandidate
