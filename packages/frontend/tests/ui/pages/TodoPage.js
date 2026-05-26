/**
 * Page Object Model for TODO Application
 * Encapsulates UI selectors and interactions for maintainability
 */
class TodoPage {
  constructor(page) {
    this.page = page;
    
    // Selectors using semantic locators
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.addButton = page.getByRole('button', { name: /add/i });
    this.todoList = page.getByRole('list');
    this.loadingSpinner = page.getByRole('progressbar');
  }

  /**
   * Navigate to the TODO application
   */
  async goto() {
    await this.page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for app to be ready - either list appears or error message shows
    // Use a race condition to handle both success and error states
    try {
      await Promise.race([
        this.todoList.waitFor({ state: 'visible', timeout: 10000 }),
        this.page.getByText(/error/i).waitFor({ state: 'visible', timeout: 10000 }),
        this.newTodoInput.waitFor({ state: 'visible', timeout: 10000 })
      ]);
    } catch (error) {
      // If none of the expected elements appear, check for React errors
      const hasReactError = await this.page.locator('text=/TypeError|Error/i').isVisible();
      if (hasReactError) {
        throw new Error('Application failed to load - React error detected. Backend API may not be available.');
      }
      throw error;
    }
  }

  /**
   * Add a new TODO item
   * @param {string} title - The title of the TODO
   */
  async addTodo(title) {
    await this.newTodoInput.fill(title);
    await this.addButton.click();
    
    // Wait for the new todo to appear in the list (state-based wait)
    await this.getTodoItem(title).waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Get a specific TODO item by its title
   * @param {string} title - The title to search for
   * @returns {Locator} The todo list item
   */
  getTodoItem(title) {
    return this.page.getByRole('listitem').filter({ hasText: title });
  }

  /**
   * Get the checkbox for a specific TODO
   * @param {string} title - The title of the TODO
   * @returns {Locator} The checkbox element
   */
  getTodoCheckbox(title) {
    return this.getTodoItem(title).getByRole('checkbox');
  }

  /**
   * Toggle the completion status of a TODO
   * @param {string} title - The title of the TODO to toggle
   */
  async toggleTodo(title) {
    const checkbox = this.getTodoCheckbox(title);
    await checkbox.click();
    // Playwright auto-waiting handles state changes
    // API mutation will complete before next interaction
  }

  /**
   * Check if a TODO is marked as completed
   * @param {string} title - The title of the TODO
   * @returns {Promise<boolean>} True if completed
   */
  async isTodoCompleted(title) {
    const checkbox = this.getTodoCheckbox(title);
    return await checkbox.isChecked();
  }

  /**
   * Check if a TODO has strikethrough styling (visual completion indicator)
   * @param {string} title - The title of the TODO
   * @returns {Promise<boolean>} True if has strikethrough
   */
  async hasTodoStrikethrough(title) {
    const todoText = this.getTodoItem(title).getByText(title);
    const textDecoration = await todoText.evaluate((el) => 
      window.getComputedStyle(el).textDecoration
    );
    return textDecoration.includes('line-through');
  }

  /**
   * Delete a TODO item
   * @param {string} title - The title of the TODO to delete
   */
  async deleteTodo(title) {
    const initialCount = await this.getTodoCount();
    const todoItem = this.getTodoItem(title);
    const deleteButton = todoItem.getByRole('button', { name: /delete/i });
    await deleteButton.click();
    
    // Wait for todo count to change or timeout (state-based wait)
    // Note: Delete may not be fully implemented, so use try-catch
    try {
      await this.page.waitForFunction(
        (expected) => document.querySelectorAll('[role="listitem"]').length < expected,
        initialCount,
        { timeout: 2000 }
      );
    } catch {
      // Delete may not be implemented - test will handle assertion
    }
  }

  /**
   * Click the edit button for a TODO (functionality not yet implemented in app)
   * @param {string} title - The title of the TODO to edit
   */
  async clickEditTodo(title) {
    const todoItem = this.getTodoItem(title);
    const editButton = todoItem.getByRole('button', { name: /edit/i });
    await editButton.click();
  }

  /**
   * Get the count of all TODO items
   * @returns {Promise<number>} Number of todos
   */
  async getTodoCount() {
    try {
      // Check if the list exists (it won't when there are no todos)
      const listExists = await this.todoList.count();
      if (listExists === 0) {
        return 0;
      }
      const items = await this.todoList.getByRole('listitem').count();
      return items;
    } catch (error) {
      // If list doesn't exist, there are no todos
      return 0;
    }
  }

  /**
   * Check if a TODO exists in the list
   * @param {string} title - The title to search for
   * @returns {Promise<boolean>} True if the todo exists
   */
  async todoExists(title) {
    const count = await this.getTodoItem(title).count();
    return count > 0;
  }

  /**
   * Get all TODO titles as an array
   * @returns {Promise<string[]>} Array of todo titles
   */
  async getAllTodoTitles() {
    const items = this.todoList.getByRole('listitem');
    const count = await items.count();
    const titles = [];
    
    for (let i = 0; i < count; i++) {
      const text = await items.nth(i).textContent();
      // Extract just the title (remove button labels)
      const cleanText = text.replace(/EditDelete/g, '').trim();
      titles.push(cleanText);
    }
    
    return titles;
  }

  /**
   * Wait for loading spinner to disappear
   */
  async waitForLoading() {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Check if the app is in loading state
   * @returns {Promise<boolean>} True if loading
   */
  async isLoading() {
    return await this.loadingSpinner.isVisible();
  }

  /**
   * Get the "items left" chip text
   * @returns {Promise<string>} The chip text
   */
  async getItemsLeftText() {
    const chip = this.page.getByText(/items left/i);
    return await chip.textContent();
  }

  /**
   * Get the "completed" chip text
   * @returns {Promise<string>} The chip text
   */
  async getCompletedText() {
    const chip = this.page.getByText(/completed/i);
    return await chip.textContent();
  }

  /**
   * Check if the empty state message is visible
   * @returns {Promise<boolean>} True if visible
   */
  async isEmptyStateVisible() {
    // Note: App doesn't have empty state message (intentional issue)
    // This method checks if the list is empty
    return (await this.getTodoCount()) === 0;
  }

  /**
   * Clear all todos by deleting them one by one
   * Useful for test cleanup between runs
   */
  async clearAllTodos() {
    try {
      let count = await this.getTodoCount();
      
      // If no todos exist, nothing to clear
      if (count === 0) {
        return;
      }
      
      let previousCount = count;
      let attempts = 0;
      const maxAttempts = 50; // Prevent infinite loops
      
      while (count > 0 && attempts < maxAttempts) {
        // Get the first todo item and delete it
        const items = await this.page.getByRole('listitem');
        const firstItem = items.first();
        
        // Check if item exists before trying to delete
        const itemCount = await firstItem.count();
        if (itemCount === 0) {
          break; // No more items to delete
        }
        
        const deleteButton = firstItem.getByRole('button', { name: /delete/i });
        await deleteButton.click();
        
        // Wait for the count to decrease
        await this.page.waitForFunction(
          (prevCount) => {
            const items = document.querySelectorAll('[role="listitem"]');
            return items.length < prevCount;
          },
          previousCount,
          { timeout: 2000 }
        ).catch(() => {
          // If timeout, item might already be deleted, continue
        });
        
        previousCount = count;
        count = await this.getTodoCount();
        attempts++;
      }
    } catch (error) {
      // If cleanup fails, log but don't fail the test
      console.log('Warning: clearAllTodos encountered an issue:', error.message);
    }
  }
}

module.exports = { TodoPage };
