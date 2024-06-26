import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiServices } from '../../../Services/ApiServices';
import { setToast } from '../../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../../Toast/ToastColors';
import NameGenerator from '../../Common/NameGenerator';
import { formatDate, taskStatuses } from '../../../Utils';
import { Label } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import UserStoryComments from './UserStoryComments';
import CloseIcon from '@mui/icons-material/Close';
import ImageGenerator from '../../Common/ImageGenerator';

const EditUserStory = ({ }) => {
    const [open, setOpen] = useState(true)
    const { email, image, user_id, userName } = useSelector(
        (store) => store.auth.loginDetails
    );
    const projectUsers  = useSelector(
        (store) => store.proj.projectUsers
    );
    const [newComment, setNewComment] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([])
    useEffect(() => {
        ApiServices.getAllUsers({ type: '' }).then(res => {
            setUsers(res.data)
        }).catch(err => {
            dispatch(setToast({
                message: "Error occured !",
                bgColor: ToastColors.failure,
                visible: "yes",
            }))
        })
    }, [])

    const [userStory, setUserStory] = useState(null)
    const [OldTaskData, setOldTaskData] = useState(null)
    const { projectId, userStoryId } = useParams()
    const navigate = useNavigate()

    const handleClose = () => {
        setOpen(false);
                navigate('/home')

    };

    const dispatch = useDispatch();
    useEffect(() => {
        if (userStoryId) {
            ApiServices.getsingleUserStory({ userStoryId: userStoryId }).then(res => {
                setUserStory(res.data)
                setOldTaskData(res.data)
            }).catch(err => {
                dispatch(
                    setToast({
                        message: "Error occured !",
                        bgColor: ToastColors.failure,
                        visible: "yes",
                    })
                );
            })
        }
    }, [userStoryId])


    const [userStoryComment, setUserStoryComment] = useState([])
    useEffect(() => {
        if (userStoryId) {
            ApiServices.getUserStoryComments({ userStoryId: userStoryId }).then(res => {
                setUserStoryComment(res.data)
            }).catch(err => {
                dispatch(
                    setToast({
                        message: "Error occured !",
                        bgColor: ToastColors.failure,
                        visible: "yes",
                    })
                );
            })
        }
    }, [userStoryId])


    const addUserStoryComment = async () => {
        await ApiServices.addUserStoryComments({ userStoryId: userStoryId, comment: newComment, commentBy: user_id }).then(res => {
            setUserStoryComment(prev => [res.data, ...prev])
            setNewComment('')
        }).catch(err => {
            dispatch(
                setToast({
                    message: "Error occured !",
                    bgColor: ToastColors.failure,
                    visible: "yes",
                })
            );
        })
    
    }


    const updateUserStory = async () => {
        setIsLoading(true);
        await ApiServices.updateUserStory({ userStoryid: userStoryId, owner: userStory?.owner, name: userStory?.name, description: userStory?.description, updatedBy: user_id, status: userStory?.status }).then(res => {
            dispatch(
                setToast({
                    message: "User Story updated",
                    bgColor: ToastColors.Success,
                    visible: "yes",
                })
            );
                    navigate('/home')
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }).catch(err => {
            dispatch(
                setToast({
                    message: "Error occured !",
                    bgColor: ToastColors.failure,
                    visible: "yes",
                })
            );
            setIsLoading(false);
        })
    }
  return (
      <Dialog fullScreen
          open={true}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          
      >
          
          <div style={{ background: 'var(--body-color)', color: 'var(--text-total-color)'}}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'fixed', right: '10px', top: '3px', background: 'var( --user-details-container-bg)', color: 'var(--text-total-color)', borderRadius: '50%', width: '35px', height: '35px', fontSize: '14px', alignItems: 'center' }}>
                  <CloseIcon style={{ cursor: 'pointer', fontSize: '25px', transform: 'translateX(-3px)' }} onClick={handleClose} />
              </div>
              <div style={{ padding: '10px', borderLeft: `6px solid ${taskStatuses.filter(f => f.status == userStory?.status)[0]?.color}` }}>
                  {userStory && window.location.pathname.includes('userStory') &&
                      <div>
                          <div>
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                  <i class="fas fa-book-open" style={{ color: taskStatuses.filter(f => f.status == userStory?.status)[0]?.color }} ></i><span style={{ fontSize: '20px', fontWeight: '600' }}>User Story {userStory?._id}</span>
                              </div>

                          </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center'}}>
                              <input type='text' placeholder='Enter name' style={{ fontSize: '16px', width: '100%', background: 'var( --user-details-container-bg)', color: 'var(--text-total-color)' }} value={userStory?.name} onChange={(e) => { setUserStory((prev) => ({ ...prev, name: e.target.value })) }}></input>
                          </div>
                         
                         
                          <div style={{position: 'relative' }}>
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', }} onClick={() => {
                                  document.getElementsByClassName('userStoryEditAllUserBox')[0].classList.toggle('showuserStoryEditAllUserBox')
                                  document.getElementsByClassName('userStoryEditStatus')[0].classList.remove('showuserStoryEditStatus')
                              }}>
                                  <div>
                                      {(userStory?.owner?.image !== undefined && userStory?.owner?.image !== '' && userStory?.owner?.image.url !== "") ? 
                                          <ImageGenerator userName={userName} img={userStory?.owner?.image.url} sizes={{height:'43px', width: '43px'}} /> : <NameGenerator userName={userStory?.owner?.userName} sizes={{ height: '35px', width: '35px', fontSize: '8px' }} />}

                                  </div>
                                  <div>{userStory?.owner?.userName} <i className='fas fa-caret-down'></i> (Owner)</div>

                              </div>
                              <div className='userStoryEditAllUserBox' style={{ display: 'none', cursor: 'pointer' }} onMouseLeave={() => {
                                  document.getElementsByClassName('userStoryEditAllUserBox')[0].classList.remove('showuserStoryEditAllUserBox')
                              }}>
                                  {projectUsers.length>0 ? projectUsers?.map(d => (
                                      <div style={{display: 'flex', gap: '10px'}} onClick={(e) => {
                                          setUserStory((prev) => ({ ...prev, owner: d }))
                                          document.getElementsByClassName('userStoryEditAllUserBox')[0].classList.remove('showuserStoryEditAllUserBox')
                                      }}>
                                          <div>
                                              {(d?.image !== undefined && d?.image !== '' && d?.image.url !== "") ?
                                                  <ImageGenerator userName={d.userName} img={d?.image.url} sizes={{ height: '45px', width: '45px' }} /> : <NameGenerator userName={d.userName} sizes={{ height: '35px', width: '35px', fontSize: '8px' }} />}
  
                                          </div>
                                          <div style={{display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12px' }}>
                                              <div>{d.userName}</div>
                                              <div>{d.email}</div>
                                           </div>

                                      </div>
                                  )): <div>No users added to this project.</div>}
                              </div>
                          </div>

                          <div className='statusHolder' style={{ display: 'flex',justifyContent: 'space-between', alignItems: 'center', fontSize: '16px', marginTop: '10px', position: 'relative', flexWrap: 'wrap' }}>
                              <div>
                                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center', cursor: 'pointer' }} onClick={() => {
                                      document.getElementsByClassName('userStoryEditStatus')[0].classList.toggle('showuserStoryEditStatus')
                                      document.getElementsByClassName('userStoryEditAllUserBox')[0].classList.remove('showuserStoryEditAllUserBox')
                                  }}>
                                      <div className='' style={{ borderRadius: '50%', height: '10px', width: '10px', background: taskStatuses.filter(f => f.status == userStory?.status)[0]?.color }}></div> <div>{userStory?.status} <i className='fas fa-caret-down'></i></div>
                                  </div>
                                  <div className='userStoryEditStatus' style={{ display: 'none', cursor: 'pointer' }}
                                      onMouseLeave={() => {
                                          document.getElementsByClassName('userStoryEditStatus')[0].classList.remove('showuserStoryEditStatus')
                                      }}
                                  >
                                      {taskStatuses?.map(d => (
                                          <div onClick={(e) => {
                                              setUserStory((prev) => ({ ...prev, status: d.status }))
                                              document.getElementsByClassName('userStoryEditStatus')[0].classList.remove('showuserStoryEditStatus')
                                          }}>
                                              {d.status}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                              <div>
                                  Updated by {userStory?.lastUpdatedBy?.userName}, {formatDate(userStory?.updatedAt)}
                              </div>
                          </div>

                          
                          
                      </div>
                  }
              </div>
              <div className='detailsContainer'>
                  <div className='leftDetailsContainer'>
                      <div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', padding: '10px' }}>
                              <label>Description</label>
                              <textarea
                                  style={{ resize: "none", outline: 'none', border: '1px solid lightgray', fontSize: '16px', width: '50%', height: '150px', padding: '10px', background: 'var( --user-details-container-bg)', color: 'var(--text-total-color)' }} value={userStory?.description} onChange={(e) => { setUserStory((prev) => ({ ...prev, description: e.target.value })) }}
                                  id=""
                                  cols="2"
                                  rows="12"
                                  name="message"
                                  placeholder="Description"
                              ></textarea>
                          </div>
                      </div>
                      <div style={{ padding: '10px' }}>
                          <button
                              disabled={(userStory?.name == OldTaskData?.name && userStory?.description == OldTaskData?.description && userStory?.owner?._id == OldTaskData?.owner?._id && userStory?.status==OldTaskData?.status) || isLoading}
                              onClick={updateUserStory}
                              style={{ whiteSpace: 'nowrap', position: 'relative' }}
                          >
                              {isLoading ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                      <div className="button-loader"></div>
                                      <div><span style={{ marginLeft: '10px' }}>Updating...</span></div>
                                  </div>
                              ) : (
                                  <>Update {window.location.pathname.includes('userStory') ? 'User Story' : 'Task'}</>
                              )}
                          </button>
                      </div>

                      <div style={{ padding: '10px' }}>
                          <label>Discussion</label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div>
                                      {(image !== undefined && image !== "") ?
                                      <ImageGenerator userName={userName} img={image} sizes={{height:'50px', width: '50px'}} />
                                        : <NameGenerator userName={userName} sizes={{ height: '40px', width: '40px', fontSize: '26px' }} />}

                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', }}>
                                      <textarea
                                          style={{ resize: "none", outline: 'none', border: '1px solid lightgray', fontSize: '16px', width: '400px', padding: '10px', background: 'var( --user-details-container-bg)', color: 'var(--text-total-color)' }} value={newComment} onChange={(e) => { setNewComment(e.target.value) }}
                                          id=""
                                          cols="30"
                                          className='discussionEditUserStory'

                                          rows="2"
                                          name="message"
                                          placeholder="Description"
                                      ></textarea>
                                      <div style={{ cursor: 'pointer' }} onClick={addUserStoryComment}><SendIcon /></div>
                                  </div>
                              </div>
                              {userStoryComment?.map(us => (
                                  <UserStoryComments us={us} />
                              ))}
                          </div>
                      </div>
                  </div>

                  <div className='rightDetailsContainer'>
                      <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                          { userStory?.taskIds?.length > 0 && <div style={{fontSize: '18px', fontWeight: '600'}}>Associated Tasks</div>}
                          {userStory?.taskIds?.map(ts => (
                              <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }} onClick={() => navigate(`/task/${projectId}/${userStory?._id}/${ts._id}/edit`)}>
                                  <div>
                                      {(ts?.owner?.image !== undefined && ts?.owner?.image !== '' && ts?.owner?.image.url !== "") ?
                                        <ImageGenerator userName={ts?.owner?.userName} img={ts?.owner?.image.url} sizes={{height:'50px', width: '50px'}} />
                                            : <NameGenerator userName={ts?.owner?.userName} sizes={{ height: '40px', width: '40px', fontSize: '8px' }} />}

                                  </div>
                                  <div>
                                      <div>{ts?.owner?.userName} (Owner)</div>
                                      <div className='associatedtaskstatus' style={{ display: 'flex', gap: '25px' }}><span style={{ whiteSpace: 'nowrap', width: '200px', textOverflow: 'ellipsis', overflow: 'hidden' }}>{ts?.name}</span>
                                          <div  style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                              <div className='' style={{ borderRadius: '50%', height: '10px', width: '10px', background: taskStatuses.filter(f => f.status == ts?.status)[0]?.color }}></div> <div>{ts?.status}</div>

                                          </div>
                                          <div className='associatedUpdateTime'>
                                              {/* Updated by {users?.filter(u => u._id == ts?.lastUpdatedBy)[0]?.userName},  */}
                                              {formatDate(ts?.updatedAt)}
                                          </div> 
                                      </div>
                                  </div>

                              </div>
                          ))}
                      </div>
                  </div>
              </div>

        </div>
      </Dialog>
  )
}

export default EditUserStory