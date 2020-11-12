/** Symbols for this mixin. */
export default {
    // Container management methods.

    /** Causes this manageR to take possession of this unowned manageD. */
    adopt: Symbol('Manage.Adopt'),
    /** Causes this manageR to make the manageD unowned. This might happen after stopping it, but might also happen because the parent is being swapped. */
    disown: Symbol('Manage.Disown'),
    /** Indicates the field on a manageD that holds the parent. */
    parent: Symbol('Manage.Parent'),

    // Play lifecycle methods.

    /**
     * Enterable from any play lifecycle; must already be adopted.
     * Causes this manageD to (best effort) reinitialize with the given argument then proceed into resume (or suspend based on initialization).
     */
    restart: Symbol('Manage.Restarting'),
    /**
     * Enterable from resume. Causes & prepares this manageD to stop getting ticks.
     */
    suspend: Symbol('Manage.Suspending'),
    /**
     * Enterable from restart and suspend. Causes & prepares this manageD to start getting ticks.
     */
    resume: Symbol('Manage.Resuming'),
    /**
     * Enterable from any play lifecycle & is initial state. Causes this manageD to free its resources and prepare to exit.
     */
    terminate: Symbol('Manage.Terminating'),

    // Execution lifecycle methods.
    preUpdate: Symbol('Manage.PreUpdate'),
    update: Symbol('Manage.Update'),
};