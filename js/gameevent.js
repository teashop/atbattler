/** Game Event **/
var GameEvent = {
  
  /**
   * payload for a game event message
   */
  Payload: function(type, from, content) {
    this.type = type;
    this.from = from;
    this.content = content;
  },

  /**
   * Convenience factory to generate Payloads
   */
  getFactory: function(from) {
    var factory = {
      create: function(type, content) {
        return new GameEvent.Payload(type, from, content); 
      }
    }
    return factory;
  },

  /**
   * Enumeration of message types
   */
  type: {
    player_action: 'P_ACTION',
    player_ready: 'P_READY',
    player_request_pause: 'P_R_PAUSE',
    player_request_resume: 'P_R_RESUME',
    game_setup_state: 'G_SET_STATE',
    game_ready: 'G_READY',
    game_start: 'G_START',
    game_pause: 'G_PAUSE',
    game_resume: 'G_RESUME',
    game_over: 'G_OVER',
    game_error: 'G_ERROR',
    game_broadcast: 'G_CAST',
    game_tick: 'G_TICK',
    game_duration_tick: 'G_D_TICK',
    heroes_sync: 'H_SYNC',
    heroes_ready: 'H_READY',
    heroes_dead: 'H_DEAD',
    heroes_action: 'H_ACTION'
  }
};


/** END Game Event **/
